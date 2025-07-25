import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backendIdl, canisterId as backendId } from "../../../declarations/begods_backend";
import { idlFactory as assetIdl, canisterId as assetId } from "../../../declarations/begods_assethandler";
import { AuthClient } from "@dfinity/auth-client";

// Detectar si estamos en local o producción
const isLocal = window.location.hostname === "localhost";
console.log("🌐 Hostname:", window.location.hostname);
console.log("🏠 isLocal:", isLocal);

// Función para crear actores con autenticación
export const createAuthenticatedActors = async () => {
  try {
    // Verificar si Plug está conectado primero
    if (window.ic?.plug) {
      const plugConnected = await window.ic.plug.isConnected();
      if (plugConnected) {
        console.log("🔌 Usando Plug Wallet para crear actores");
        
        // Crear actores usando Plug
        const begodsBackendActor = await window.ic.plug.createActor({
          canisterId: backendId,
          interfaceFactory: backendIdl,
        });

        const begodsAssetHandlerActor = await window.ic.plug.createActor({
          canisterId: assetId,
          interfaceFactory: assetIdl,
        });

        console.log("🎭 Actores con Plug creados exitosamente");
        return { begodsBackendActor, begodsAssetHandlerActor };
      }
    }

    // Si no es Plug, usar Internet Identity o NFID
    console.log("🆔 Usando Internet Identity/NFID para crear actores");
    
    // Obtener el AuthClient
    const authClient = await AuthClient.create();
    
    // Verificar si el usuario está autenticado
    if (!authClient.isAuthenticated()) {
      throw new Error("Usuario no autenticado. Por favor inicia sesión primero.");
    }
    
    const identity = authClient.getIdentity();
    console.log("🔐 Identity obtenida:", identity.getPrincipal().toText());

    const agent = new HttpAgent({
      host: isLocal ? "http://localhost:4943" : "https://icp0.io",
      identity: identity, // Usar la identidad autenticada
    });

    console.log("🔗 Agent host:", agent._host);

    // Solo obtener la root key en local (desarrollo)
    if (isLocal) {
      console.log("🔑 Obteniendo clave raíz local...");
      await agent.fetchRootKey();
      console.log("✅ Clave raíz obtenida exitosamente");
    }

    // Actor para el backend de NFTs/Marketplace
    const begodsBackendActor = Actor.createActor(backendIdl, {
      agent,
      canisterId: backendId,
    });

    // Actor para el assethandler (imágenes/assets)
    const begodsAssetHandlerActor = Actor.createActor(assetIdl, {
      agent,
      canisterId: assetId,
    });

    console.log("🎭 Actores autenticados creados exitosamente");
    return { begodsBackendActor, begodsAssetHandlerActor };
  } catch (error) {
    console.error("❌ Error al crear actores autenticados:", error);
    throw error;
  }
};

// Actores sin autenticación (para consultas públicas)
const agent = new HttpAgent({
  host: isLocal ? "http://localhost:4943" : "https://icp0.io",
});

// Solo obtener la root key en local (desarrollo)
if (isLocal) {
  agent.fetchRootKey().catch(err => {
    console.warn("No se pudo obtener la clave raíz local. ¿Está corriendo el dfx replica?");
    console.error(err);
  });
}

// Actor para el backend de NFTs/Marketplace (sin autenticación)
export const begodsBackendActor = Actor.createActor(backendIdl, {
  agent,
  canisterId: backendId,
});

// Actor para el assethandler (imágenes/assets) (sin autenticación)
export const begodsAssetHandlerActor = Actor.createActor(assetIdl, {
  agent,
  canisterId: assetId,
});