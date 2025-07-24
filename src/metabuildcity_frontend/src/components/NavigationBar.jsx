import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MetabuildLanding.scss";
import { AuthContext } from "../utils/AuthContext";

function abbreviatePrincipal(principal) {
  if (!principal) return "";
  return principal.slice(0, 6) + "..." + principal.slice(-5);
}

const NavigationBar = () => {
  const { principal, walletType, getWalletDisplayName, logout } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const hideTimeoutRef = useRef(null);

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMouseEnter = () => {
    // Limpiar cualquier timeout pendiente
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // Configurar timeout de 2 segundos para ocultar el menú
    hideTimeoutRef.current = setTimeout(() => {
      setShowMenu(false);
      hideTimeoutRef.current = null;
    }, 2000); // 2 segundos de delay
  };

  const getWalletIcon = () => {
    switch (walletType) {
      case 'internet_identity':
        return "🆔";
      case 'plug':
        return "🔌";
      case 'nfid':
        return "🎫";
      case 'wallet_connect':
        return "🔗";
      default:
        return "👤";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg metabuild-navbar" style={{background: "rgba(10,14,39,0.95)", borderBottom: "1px solid rgba(0,123,255,0.3)", position: "fixed", width: "100%", zIndex: 1000}}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/LogoMetaBuildCity.png" alt="MetaBuild City" height="40" style={{marginRight: 12}} />
          <span className="fw-bold text-light">MetaBuild City</span>
        </Link>
        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link text-light" to="/home">Dashboard</Link>
          <Link className="nav-link text-light" to="/">Landing</Link>
          {/* Menú de usuario */}
          <div
            className="user-info ms-3"
            style={{position: "relative"}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="d-flex align-items-center" style={{cursor: "pointer"}}>
              <span style={{fontSize: 18, marginRight: 8}}>{getWalletIcon()}</span>
              <span className="text-info" style={{fontWeight: 600}}>
                {principal ? abbreviatePrincipal(principal) : "Usuario"}
              </span>
            </div>
            {showMenu && principal && (
              <div 
                style={{position: "absolute", right: 0, top: "120%", background: "#181c2f", border: "1px solid #00d4ff", borderRadius: 10, padding: 16, minWidth: 220, zIndex: 2000, boxShadow: "0 8px 32px rgba(0,0,0,0.3)"}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div style={{fontSize: 13, color: "#b8c5d6", marginBottom: 12}}>
                  <div style={{marginBottom: 8}}>
                    <strong>Wallet:</strong> <span style={{color: "#00d4ff"}}>{getWalletDisplayName()}</span>
                  </div>
                  <div style={{marginBottom: 8}}>
                    <strong>Principal:</strong> 
                    <div style={{wordBreak: "break-all", fontSize: 11, marginTop: 4, padding: 6, background: "rgba(0,0,0,0.3)", borderRadius: 4}}>
                      {principal}
                    </div>
                  </div>
                </div>
                <button className="btn btn-danger w-100" style={{borderRadius: 8, fontWeight: 600}} onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 