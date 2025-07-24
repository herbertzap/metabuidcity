import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";

export const AuthContext = createContext();

// Tipos de wallet soportados
export const WALLET_TYPES = {
  INTERNET_IDENTITY: 'internet_identity',
  PLUG: 'plug',
  NFID: 'nfid',
  WALLET_CONNECT: 'wallet_connect'
};

export function AuthProvider({ children }) {
  const [principal, setPrincipal] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Lista de canisters para Plug wallet
  const plugWhitelist = [
    process.env.CANISTER_ID_BEGODS_BACKEND || "fwnfq-raaaa-aaaam-aenla-cai",
    process.env.CANISTER_ID_BEGODS_ASSETHANDLER || "frmde-4yaaa-aaaam-aenlq-cai",
  ];

  // Expiración automática de sesión tras 5 minutos de inactividad
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000); // 5 minutos
    };
    
    if (principal) {
      const events = ["mousemove", "keydown", "scroll", "touchstart"];
      events.forEach(event => window.addEventListener(event, resetTimer));
      resetTimer();
      
      return () => {
        clearTimeout(timeoutId);
        events.forEach(event => window.removeEventListener(event, resetTimer));
      };
    }
  }, [principal]);

  // Detectar conexiones existentes al cargar
  useEffect(() => {
    checkExistingConnections();
  }, []);

  const checkExistingConnections = async () => {
    try {
      // Verificar Internet Identity
      const authClient = await AuthClient.create();
      if (authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        const principalText = identity.getPrincipal().toText();
        if (principalText !== "2vxsx-fae") { // No es anónimo
          setPrincipal(principalText);
          setWalletType(WALLET_TYPES.INTERNET_IDENTITY);
          return;
        }
      }

      // Verificar Plug Wallet
      if (window.ic?.plug) {
        const connected = await window.ic.plug.isConnected();
        if (connected) {
          const principalText = await window.ic.plug.agent.getPrincipal().then(p => p.toText());
          setPrincipal(principalText);
          setWalletType(WALLET_TYPES.PLUG);
          return;
        }
      }
    } catch (error) {
      console.error("Error checking existing connections:", error);
    }
  };

  const loginWithInternetIdentity = async () => {
    setIsConnecting(true);
    try {
      const authClient = await AuthClient.create();
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            const principalText = identity.getPrincipal().toText();
            setPrincipal(principalText);
            setWalletType(WALLET_TYPES.INTERNET_IDENTITY);
            setIsConnecting(false);
            resolve(principalText);
          },
          onError: (error) => {
            setIsConnecting(false);
            reject(error);
          },
        });
      });
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  const loginWithNFID = async () => {
    setIsConnecting(true);
    try {
      const authClient = await AuthClient.create();
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: "https://nfid.one/authenticate/?applicationName=Metabuildcity#authorize",
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            const principalText = identity.getPrincipal().toText();
            setPrincipal(principalText);
            setWalletType(WALLET_TYPES.NFID);
            setIsConnecting(false);
            resolve(principalText);
          },
          onError: (error) => {
            setIsConnecting(false);
            reject(error);
          },
        });
      });
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  const loginWithPlug = async () => {
    setIsConnecting(true);
    try {
      // Verificar si Plug está instalado
      if (!window.ic?.plug) {
        throw new Error("Plug Wallet no está instalado. Por favor instálalo desde https://plugwallet.ooo/");
      }

      const host = window.location.hostname === "localhost" 
        ? "http://localhost:4943" 
        : "https://icp0.io";

      // Solicitar conexión
      const connected = await window.ic.plug.requestConnect({
        whitelist: plugWhitelist,
        host,
      });

      if (!connected) {
        throw new Error("Conexión con Plug Wallet rechazada");
      }

      // Obtener el principal
      const principal = await window.ic.plug.agent.getPrincipal();
      const principalText = principal.toText();
      
      setPrincipal(principalText);
      setWalletType(WALLET_TYPES.PLUG);
      setIsConnecting(false);
      
      return principalText;
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (walletType === WALLET_TYPES.INTERNET_IDENTITY || walletType === WALLET_TYPES.NFID) {
        const authClient = await AuthClient.create();
        await authClient.logout();
      } else if (walletType === WALLET_TYPES.PLUG && window.ic?.plug) {
        await window.ic.plug.disconnect();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setPrincipal(null);
      setWalletType(null);
      window.location.href = "/";
    }
  };

  const getWalletDisplayName = () => {
    switch (walletType) {
      case WALLET_TYPES.INTERNET_IDENTITY:
        return "Internet Identity";
      case WALLET_TYPES.PLUG:
        return "Plug Wallet";
      case WALLET_TYPES.NFID:
        return "NFID";
      case WALLET_TYPES.WALLET_CONNECT:
        return "WalletConnect";
      default:
        return "Desconocido";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      principal, 
      walletType,
      isConnecting,
      loginWithInternetIdentity, 
      loginWithNFID,
      loginWithPlug,
      logout,
      getWalletDisplayName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

