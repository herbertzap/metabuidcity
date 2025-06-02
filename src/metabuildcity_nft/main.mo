import Principal "mo:base/Principal";
import Array "mo:base/Array";


actor class NFTCanister() = this {

  type Metadata = { name : Text; value : Text };

  stable var nextId : Nat = 0;
  stable var tokens : [(Nat, [Metadata])] = [];
  stable var owners : [(Nat, Principal)] = [];

  public shared({ caller }) func mint(metadata: [Metadata]) : async Nat {
    let id = nextId;
    tokens := Array.append(tokens, [(id, metadata)]);
    owners := Array.append(owners, [(id, caller)]);
    nextId += 1;
    return id;
  };

  public query func getToken(id: Nat) : async ?[Metadata] {
    for ((tid, meta) in tokens.vals()) {
      if (tid == id) {
        return ?meta;
      }
    };
    return null;
  };

  public query func getOwner(id: Nat) : async ?Principal {
    for ((tid, owner) in owners.vals()) {
      if (tid == id) {
        return ?owner;
      }
    };
    return null;
  };

  public query func getAllTokens() : async [(Nat, [Metadata])] {
    return tokens;
    };
}
