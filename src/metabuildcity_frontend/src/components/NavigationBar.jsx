import React from "react";
import { Link } from "react-router-dom";
import * as bootstrap from 'bootstrap';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { loginWithInternetIdentity } from '../utils/ic-auth';
import { useAccount } from 'wagmi';

function NavigationBar() {
  const { address, isConnected } = useAccount();

  const handleInternetIdentityLogin = async () => {
    try {
      const modalElement = document.getElementById('walletLoginModal');
      const principal = await loginWithInternetIdentity();
      console.log('✅ Principal autenticado:', principal);
      alert(`Autenticado como: ${principal}`);
    } catch (err) {
      console.error('❌ Error al conectar con Internet Identity:', err);
      alert('No se pudo iniciar sesión.\n' + err?.message || err);
    }
  };
  

  const handlePhantomLogin = () => {
    console.log('Conectar con Phantom Wallet');
  };

  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">
            <img src="/LogoMetaBuildCity.png" alt="Logo" className="logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav me-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/webgl">
                  WebGL
                </Link>
              </li>
            </ul>

            <button
              className="btn btn-sm bg-primary text-bg-light"
              data-bs-toggle="modal"
              data-bs-target="#walletLoginModal"
            >
              Iniciar sesión
            </button>

            

          </div>
        </div>
      </nav>
      <div className="nav-top">

      </div>

      {/* MODAL */}
      <div
        className="modal fade"
        id="walletLoginModal"
        tabIndex="-1"
        aria-labelledby="walletLoginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5 className="modal-title" id="walletLoginModalLabel">Conectar Billetera</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex flex-column gap-3">
              {/* RainbowKit */}
              <ConnectButton showBalance={false} />

              <button className="btn btn-outline-warning" onClick={handleInternetIdentityLogin}>
                Conectar con InternetIdentity
              </button>

              {/* Phantom (Solana) */}
              <button className="btn btn-outline-warning" onClick={handlePhantomLogin}>
                Conectar con Phantom
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
