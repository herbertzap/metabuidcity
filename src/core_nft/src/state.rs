use crate::types::nft::Icrc7Token;
use crate::types::sub_canister;
use crate::types::sub_canister::StorageSubCanisterManager;

use bity_ic_canister_state_macros::canister_state;
use bity_ic_icrc3::transaction::TransactionType;
use bity_ic_icrc3_macros::icrc3_state;
use bity_ic_storage_canister_api::types::storage::UploadState;
use bity_ic_types::{BuildVersion, TimestampNanos};
use bity_ic_types::{Cycles, TimestampMillis};
use bity_ic_utils::env::{CanisterEnv, Environment};
use bity_ic_utils::memory::MemorySize;

use candid::{CandidType, Nat, Principal};
use icrc_ledger_types::icrc1::account::Account;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashMap};

pub use bity_ic_storage_canister_api::lifecycle::{init::InitArgs, post_upgrade::UpgradeArgs};

const STORAGE_WASM: &[u8] = include_bytes!("../../../wasm/storage_canister.wasm.gz");

icrc3_state!();
canister_state!(RuntimeState);

#[derive(Serialize, Deserialize, Clone)]
pub struct RuntimeState {
    pub env: CanisterEnv,
    pub data: Data,
    pub principal_guards: BTreeSet<Principal>,
    pub sliding_window_guards: HashMap<candid::Nat, Vec<TimestampNanos>>, // per token id
    pub internal_filestorage: InternalFilestorage,
}

impl RuntimeState {
    pub fn new(env: CanisterEnv, data: Data) -> Self {
        RuntimeState {
            env,
            data,
            principal_guards: BTreeSet::new(),
            sliding_window_guards: HashMap::new(),
            internal_filestorage: InternalFilestorage::new(),
        }
    }

    pub fn is_caller_governance_principal(&self) -> bool {
        self.data.authorized_principals.contains(&self.env.caller())
    }

    pub fn is_caller_minting_authority(&self) -> bool {
        self.data.minting_authorities.contains(&self.env.caller())
    }

    pub fn metrics(&self) -> Metrics {
        Metrics {
            canister_info: CanisterInfo {
                test_mode: self.env.is_test_mode(),
                now: self.env.now(),
                version: self.env.version(),
                commit_hash: self.env.commit_hash().to_string(),
                memory_used: MemorySize::used(),
                cycles_balance: self.env.cycles_balance(),
            },
            authorized_principals: self.data.authorized_principals.to_vec(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Data {
    pub authorized_principals: Vec<Principal>,
    pub minting_authorities: Vec<Principal>,
    pub description: Option<String>,
    pub symbol: String,
    pub name: String,
    pub logo: Option<String>,
    pub supply_cap: Option<Nat>,
    pub max_query_batch_size: Option<Nat>,
    pub max_update_batch_size: Option<Nat>,
    pub max_take_value: Option<Nat>,
    pub default_take_value: Option<Nat>,
    pub max_memo_size: Option<Nat>,
    pub atomic_batch_transfers: Option<bool>,
    pub tx_window: Option<Nat>,
    pub permitted_drift: Option<Nat>,
    pub max_canister_storage_threshold: Option<Nat>,
    pub tokens_list: HashMap<Nat, Icrc7Token>,
    pub tokens_list_by_owner: HashMap<Account, Vec<Nat>>,
    pub approval_init: InitApprovalsArg,
    pub sub_canister_manager: StorageSubCanisterManager,
    pub last_token_id: Nat,
    pub media_redirections: HashMap<String, String>,
}

impl Data {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        test_mode: bool,
        commit_hash: String,
        version: BuildVersion,
        authorized_principals: Vec<Principal>,
        minting_authorities: Vec<Principal>,
        description: Option<String>,
        symbol: String,
        name: String,
        logo: Option<String>,
        supply_cap: Option<Nat>,
        max_query_batch_size: Option<Nat>,
        max_update_batch_size: Option<Nat>,
        max_take_value: Option<Nat>,
        default_take_value: Option<Nat>,
        max_memo_size: Option<Nat>,
        atomic_batch_transfers: Option<bool>,
        tx_window: Option<Nat>,
        max_canister_storage_threshold: Option<Nat>,
        permitted_drift: Option<Nat>,
        approval_init: InitApprovalsArg,
    ) -> Self {
        let sub_canister_manager = StorageSubCanisterManager::new(
            sub_canister::ArgsStorage::Init(InitArgs {
                test_mode: test_mode.clone(),
                version,
                commit_hash: commit_hash.clone(),
                authorized_principals: authorized_principals
                    .clone()
                    .into_iter()
                    .chain(vec![ic_cdk::api::canister_self()].into_iter())
                    .collect(),
            }),
            sub_canister::ArgsStorage::Upgrade(UpgradeArgs {
                version,
                commit_hash: commit_hash.clone(),
            }),
            ic_cdk::api::canister_self(),
            HashMap::new(),
            vec![],
            authorized_principals.clone(),
            2_000_000_000_000, // todo gwojda create constant here
            2_000_000_000_000, // todo gwojda create constant here
            test_mode.clone(),
            commit_hash.clone(),
            STORAGE_WASM.to_vec(),
        );

        Self {
            authorized_principals: authorized_principals.into_iter().collect(),
            minting_authorities: minting_authorities.into_iter().collect(),
            description,
            symbol,
            name,
            logo,
            supply_cap,
            max_query_batch_size,
            max_update_batch_size,
            max_take_value,
            default_take_value,
            max_memo_size,
            atomic_batch_transfers,
            tx_window,
            permitted_drift,
            max_canister_storage_threshold,
            tokens_list: HashMap::new(),
            tokens_list_by_owner: HashMap::new(),
            approval_init,
            sub_canister_manager,
            last_token_id: Nat::from(1u64), // 0 is the reserved value for the collection metadata
            media_redirections: HashMap::new(),
        }
    }

    pub fn get_token_by_id(&self, token_id: &Nat) -> Option<&Icrc7Token> {
        self.tokens_list.get(token_id)
    }

    pub fn update_token_by_id(&mut self, token_id: &Nat, token: &Icrc7Token) {
        self.tokens_list.insert(token_id.clone(), token.clone());
    }

    pub fn add_token(&mut self, token: &Icrc7Token) {
        self.tokens_list
            .insert(token.clone().token_id, token.clone());
    }

    pub fn owner_of(&self, token_id: &Nat) -> Option<Account> {
        self.tokens_list
            .get(token_id)
            .map(|token| token.token_owner.clone())
    }

    pub fn tokens_balance_of(&self, owner: &Account) -> Nat {
        Nat::from(
            self.tokens_list_by_owner
                .get(owner)
                .map(|v| v.len() as u64)
                .unwrap_or(0),
        )
    }

    pub fn tokens_of_account(&self, owner: &Account) -> Vec<Icrc7Token> {
        self.tokens_list_by_owner
            .get(owner)
            .map(|v| {
                v.iter()
                    .map(|id| self.tokens_list.get(id).unwrap().clone())
                    .collect()
            })
            .unwrap_or(vec![])
    }

    pub fn tokens_ids_of_account(&self, owner: &Account) -> Vec<Nat> {
        self.tokens_list
            .iter()
            .filter(|(_, token)| &token.token_owner == owner)
            .map(|(id, _)| id.clone())
            .collect()
    }

    pub fn total_supply(&self) -> Nat {
        Nat::from(self.tokens_list.len() as u64)
    }
}

impl Clone for Data {
    fn clone(&self) -> Self {
        Self {
            authorized_principals: self.authorized_principals.clone(),
            minting_authorities: self.minting_authorities.clone(),
            description: self.description.clone(),
            symbol: self.symbol.clone(),
            name: self.name.clone(),
            logo: self.logo.clone(),
            supply_cap: self.supply_cap.clone(),
            max_query_batch_size: self.max_query_batch_size.clone(),
            max_update_batch_size: self.max_update_batch_size.clone(),
            max_take_value: self.max_take_value.clone(),
            default_take_value: self.default_take_value.clone(),
            max_memo_size: self.max_memo_size.clone(),
            atomic_batch_transfers: self.atomic_batch_transfers.clone(),
            tx_window: self.tx_window.clone(),
            permitted_drift: self.permitted_drift.clone(),
            max_canister_storage_threshold: self.max_canister_storage_threshold.clone(),
            tokens_list: self.tokens_list.clone(),
            tokens_list_by_owner: self.tokens_list_by_owner.clone(),
            approval_init: self.approval_init.clone(),
            sub_canister_manager: self.sub_canister_manager.clone(),
            last_token_id: self.last_token_id.clone(),
            media_redirections: self.media_redirections.clone(),
        }
    }
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct InitApprovalsArg {
    pub max_approvals_per_token_or_collection: Option<Nat>,
    pub max_revoke_approvals: Option<Nat>,
}

#[derive(CandidType, Serialize)]
pub struct Metrics {
    pub canister_info: CanisterInfo,
    pub authorized_principals: Vec<Principal>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct CanisterInfo {
    pub now: TimestampMillis,
    pub test_mode: bool,
    pub version: BuildVersion,
    pub commit_hash: String,
    pub memory_used: MemorySize,
    pub cycles_balance: Cycles,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct InternalFilestorageData {
    pub init_timestamp: TimestampNanos,
    pub state: UploadState,
    pub canister: Principal,
    pub path: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct InternalFilestorage {
    pub map: HashMap<String, InternalFilestorageData>,
}

impl InternalFilestorage {
    pub fn new() -> Self {
        Self {
            map: HashMap::new(),
        }
    }

    pub fn insert(&mut self, path: String, data: InternalFilestorageData) {
        self.map.insert(path, data);
    }

    pub fn get(&self, path: &str) -> Option<&InternalFilestorageData> {
        self.map.get(path)
    }

    pub fn remove(&mut self, path: &str) -> Option<InternalFilestorageData> {
        self.map.remove(path)
    }

    pub fn contains_path(&self, path: &str) -> bool {
        self.map.values().any(|data| data.path == path)
    }

    pub fn get_all_files(&self) -> Vec<(String, InternalFilestorageData)> {
        self.map
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect()
    }
}
#[cfg(test)]
mod tests {}
