import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import "../components/MetabuildLanding.scss";
import CreateVirtualFair from "../components/CreateVirtualFair";
import UserProfile from "./UserProfile";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import '../components/dashboard.scss';

const mockNFTs = [
  {
    title: "WORLD COMPUTER METAVERSE 2025",
    subtitle: "Chile Fintech Forum 2025",
    description: "Metaverso Chile Fintech Forum 2025",
    image: "/assets/images/business-model-1.png",
    button: "VER PRODUCTOS"
  },
  {
    title: "La Cumbre Digital 2025",
    subtitle: "La Cumbre Digital 2025",
    description: "Metaverso La Cumbre Digital 2025",
    image: "/assets/images/business-model-2.png",
    button: "VER PRODUCTOS"
  },
  {
    title: "CHILE FINTECH FORUM 2025",
    subtitle: "Chile Fintech Forum 2025",
    description: "Metaverso Chile Fintech Forum 2025",
    image: "/assets/images/business-model-1.png",
    button: "VER PRODUCTOS"
  }
];

const DashboardHome = () => {
  const [showForm, setShowForm] = useState(false);
  const handleMintClick = () => setShowForm(true);
  const handleFormClose = () => setShowForm(false);
  return (
    <>
      <h1 className="dashboard-title">EVENTOS Y HUBS</h1>
      <p className="dashboard-subtitle">Selecciona tu evento virtual</p>
      {!showForm ? (
        <div className="nft-cards-row" style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
          <div className="nft-card mint-card" style={{minWidth:280,maxWidth:320,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',border:'2px solid #00d4ff',borderRadius:20,padding:'2rem',background:'rgba(0,0,0,0.15)'}} onClick={handleMintClick}>
            <div style={{fontWeight:700,fontSize:'1.2rem',color:'#cfd8ff',marginBottom:'1rem'}}>MINTEAR NFT</div>
            <div style={{width:90,height:90,background:'linear-gradient(135deg,#00d4ff,#007bff)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.5rem'}}>
              <span style={{fontSize:60,color:'#fff',fontWeight:900}}>+</span>
            </div>
            <div style={{fontWeight:900,fontSize:'1.3rem',color:'#fff'}}>CREA TU FERIA</div>
          </div>
          {mockNFTs.map((nft, i) => (
            <div key={i} className="nft-card" style={{minWidth:280,maxWidth:320,border:'2px solid #00d4ff',borderRadius:20,padding:'1.5rem',background:'rgba(0,0,0,0.10)',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <img src={nft.image} alt={nft.title} style={{width:'100%',borderRadius:12,marginBottom:'1rem',objectFit:'cover',maxHeight:120}} />
              <div style={{fontWeight:900,fontSize:'1.1rem',color:'#fff',marginBottom:4}}>{nft.title}</div>
              <div style={{fontWeight:700,fontSize:'1rem',color:'#b8c5d6',marginBottom:4}}>{nft.subtitle}</div>
              <div style={{fontSize:'0.95rem',color:'#b8c5d6',marginBottom:12}}>{nft.description}</div>
              <button className="btn btn-info w-100" style={{background:'#00d4ff',color:'#181c2f',fontWeight:700,borderRadius:20}}>{nft.button}</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <CreateVirtualFair onCancel={handleFormClose} onSuccess={handleFormClose} />
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  const { principal } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!principal) {
      navigate("/", { replace: true });
    }
  }, [principal, navigate]);
  return (
    <div className="dashboard-layout">
      <NavigationBar />
      <div className="dashboard-main">
        <SidebarMenu />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 