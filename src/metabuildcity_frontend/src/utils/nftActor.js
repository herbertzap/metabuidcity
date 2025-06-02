import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/metabuildcity_nft/metabuildcity_nft.did.js";
import { canisterId } from "../../../declarations/metabuildcity_nft";

// Detectar si estamos en entorno local
const isLocal = window.location.hostname === "localhost";

const agent = new HttpAgent({
  host: isLocal ? "http://localhost:4943" : "https://icp0.io",
});

// Solo obtener la root key en local
if (isLocal) {
  agent.fetchRootKey().catch(err => {
    console.warn("No se pudo obtener la clave raíz local. ¿Está corriendo el dfx replica?");
    console.error(err);
  });
}

const nftActor = Actor.createActor(idlFactory, {
  agent,
  canisterId, // fj6gd-6yaaa-aaaam-aekua-cai
});

export default nftActor;
