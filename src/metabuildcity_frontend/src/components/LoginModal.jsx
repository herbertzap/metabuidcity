import React, { useContext, useState } from "react";
import { AuthContext, WALLET_TYPES } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedActors } from '../utils/begodsActors';
import { Principal } from '@dfinity/principal';

const LoginModal = ({ show, onClose }) => {
  const { 
    loginWithInternetIdentity, 
    loginWithNFID, 
    loginWithPlug, 
    isConnecting 
  } = useContext(AuthContext);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const navigate = useNavigate();

  const walletOptions = [
    {
      id: WALLET_TYPES.INTERNET_IDENTITY,
      name: "Internet Identity",
      description: "Autenticación descentralizada de ICP",
      icon: "🆔",
      loginFunction: loginWithInternetIdentity,
      available: true
    },
    {
      id: WALLET_TYPES.PLUG,
      name: "Plug Wallet",
      description: "Wallet nativa para Internet Computer",
      icon: "🔌",
      loginFunction: loginWithPlug,
      available: typeof window !== 'undefined' && window.ic?.plug
    },
    {
      id: WALLET_TYPES.NFID,
      name: "NFID",
      description: "Alternativa moderna a Internet Identity",
      icon: "🎫",
      loginFunction: loginWithNFID,
      available: true
    }
  ];

  const handleWalletLogin = async (walletOption) => {
    if (!walletOption.available) {
      if (walletOption.id === WALLET_TYPES.PLUG) {
        alert("Plug Wallet no está instalado. Por favor instálalo desde https://plugwallet.ooo/");
        window.open("https://plugwallet.ooo/", "_blank");
      }
      return;
    }

    setSelectedWallet(walletOption.id);
    try {
      const principalText = await walletOption.loginFunction();
      
      // Crear usuario en el backend si no existe
      try {
        const { begodsBackendActor } = await createAuthenticatedActors();
        await begodsBackendActor.create_user(Principal.fromText(principalText), "");
      } catch (e) {
        console.log("Usuario ya existe o error creando usuario:", e);
      }
      
      onClose();
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    } finally {
      setSelectedWallet(null);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.7)', 
      zIndex: 2000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <div className="modal-content" style={{
        background: '#181c2f', 
        borderRadius: 20, 
        padding: 40, 
        minWidth: 400, 
        maxWidth: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{color: '#fff', marginBottom: 16, textAlign: 'center'}}>
          Conectar Wallet
        </h2>
        <p style={{color: '#b8c5d6', marginBottom: 32, textAlign: 'center'}}>
          Elige tu método de autenticación preferido
        </p>
        
        <div className="wallet-options" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              className={`wallet-option ${!wallet.available ? 'disabled' : ''}`}
              onClick={() => handleWalletLogin(wallet)}
              disabled={isConnecting || !wallet.available}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                border: wallet.available ? '2px solid #00d4ff' : '2px solid #666',
                borderRadius: 12,
                background: wallet.available ? 'rgba(0, 212, 255, 0.1)' : 'rgba(102, 102, 102, 0.1)',
                color: wallet.available ? '#fff' : '#888',
                cursor: wallet.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: (!wallet.available || (isConnecting && selectedWallet !== wallet.id)) ? 0.5 : 1
              }}
            >
              <div style={{fontSize: 24, marginRight: 16}}>
                {isConnecting && selectedWallet === wallet.id ? '⏳' : wallet.icon}
              </div>
              <div style={{flex: 1, textAlign: 'left'}}>
                <div style={{fontWeight: 700, fontSize: '1.1rem', marginBottom: 4}}>
                  {wallet.name}
                  {!wallet.available && ' (No disponible)'}
                </div>
                <div style={{fontSize: '0.9rem', opacity: 0.8}}>
                  {wallet.description}
                </div>
              </div>
              {isConnecting && selectedWallet === wallet.id && (
                <div style={{marginLeft: 12, color: '#00d4ff'}}>
                  Conectando...
                </div>
              )}
            </button>
          ))}
        </div>

        <div style={{marginTop: 24, textAlign: 'center'}}>
          <button 
            className="btn btn-link" 
            onClick={onClose} 
            disabled={isConnecting}
            style={{color: '#b8c5d6', background: 'none', border: 'none', cursor: 'pointer'}}
          >
            Cancelar
          </button>
        </div>

        {/* Información adicional */}
        <div style={{marginTop: 20, padding: 16, background: 'rgba(0, 212, 255, 0.05)', borderRadius: 8}}>
          <p style={{color: '#b8c5d6', fontSize: '0.85rem', margin: 0, textAlign: 'center'}}>
            💡 <strong>Tip:</strong> Si no tienes ninguna wallet, recomendamos empezar con Internet Identity (gratuito y seguro)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 