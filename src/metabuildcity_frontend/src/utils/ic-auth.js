import {
    AuthClient
  } from "@dfinity/auth-client";
  import { createActor, canisterId } from '../../../declarations/metabuildcity_backend';


  
  const loginWithInternetIdentity = async () => {
    const authClient = await AuthClient.create();
  
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize", // o tu local si estás en dev
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
  
        // ⚠️ Aquí puedes llamar a tu canister
        const backend = createActor();
        await backend.registerUser();
  
        console.log("Autenticado:", principal.toText());
      }
    });
  };
  
  export { loginWithInternetIdentity };
  