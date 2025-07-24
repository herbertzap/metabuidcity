import React, { useState, useEffect } from "react";
import CreateVirtualFair from "../components/CreateVirtualFair";
import { createAuthenticatedActors } from '../utils/begodsActors';
import { useAuth } from '../utils/AuthContext';
import '../components/dashboard.scss';
import { Principal } from '@dfinity/principal';

const DashboardHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { principal } = useAuth();

  const handleMintClick = () => setShowForm(true);
  const handleFormClose = () => {
    setShowForm(false);
    // Recargar NFTs después de crear uno nuevo con un pequeño delay
    setTimeout(() => {
      console.log("🔄 Refrescando NFTs después de crear nuevo...");
      loadUserNFTs();
    }, 1000); // 1 segundo de delay para asegurar que el backend esté actualizado
  };

  // Función para obtener la URL de la imagen desde el assethandler
  const getImageUrl = (imgId) => {
    // Verificar si imgId es válido
    if (!imgId || imgId === 'undefined' || imgId === 'null') {
      return "/assets/images/business-model-1.png";
    }
    
    const isLocal = window.location.hostname === "localhost";
    if (isLocal) {
      return `http://127.0.0.1:4943/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai&imgid=${imgId}`;
    } else {
      return `https://frmde-4yaaa-aaaam-aenlq-cai.raw.icp0.io/?imgid=${imgId}`;
    }
  };

  // Función para cargar los NFTs del usuario
  const loadUserNFTs = async () => {
    if (!principal) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { begodsBackendActor } = await createAuthenticatedActors();
      
      // 1. Obtener las colecciones del usuario
      const userCollections = await begodsBackendActor.getUserCollectionDetails();
      
      if (!userCollections || userCollections.length === 0) {
        console.log("No se encontraron colecciones para el usuario");
        setUserNFTs([]);
        setLoading(false);
        return;
      }

      console.log("🏛️ Colecciones del usuario:", userCollections);

      // 2. Obtener NFTs de cada colección
      const allNFTs = [];
      
      for (const [timestamp, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata] of userCollections) {
        try {
          console.log(`🔍 Elemento de colección raw:`, [timestamp, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata]);
          console.log(`📋 Tipo de collectionCanisterId:`, typeof collectionCanisterId, collectionCanisterId);
          
          // El collectionCanisterId viene como un array con formato: [timestamp, canisterId, name, symbol, metadata]
          // Necesitamos extraer el canisterId que está en la posición 1
          let canisterIdStr = null;
          let canisterIdObject = null;
          
          if (Array.isArray(collectionCanisterId) && collectionCanisterId.length >= 2) {
            // Extraer el canister ID del array (posición 1)
            canisterIdObject = collectionCanisterId[1];
            
            if (typeof canisterIdObject === 'object' && canisterIdObject.__principal__) {
              canisterIdStr = canisterIdObject.__principal__;
            } else if (typeof canisterIdObject === 'object' && canisterIdObject.toText) {
              canisterIdStr = canisterIdObject.toText();
            } else if (typeof canisterIdObject === 'string') {
              canisterIdStr = canisterIdObject;
            }
          }

          if (!canisterIdStr || !canisterIdObject) {
            console.log(`❌ No se pudo extraer canister ID válido, saltando...`);
            continue;
          }

          console.log(`🔍 Procesando colección: ${collectionName} (${canisterIdStr})`);
          console.log(`📋 Datos de colección completos:`, { timestamp, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata });
          
          // Usar el objeto Principal original en lugar del string
          const nftsResponse = await begodsBackendActor.getAllCollectionNFTs(canisterIdObject, 50, 0);
          
          if (nftsResponse.ok && nftsResponse.ok.data.length > 0) {
            console.log(`📦 NFTs encontrados en colección ${collectionName}:`, nftsResponse.ok.data);
            
            // Procesar cada NFT
            for (const nft of nftsResponse.ok.data) {
              try {
                console.log(`🎯 Procesando NFT individual:`, nft);
                
                // Extraer datos del NFT - el formato es [tokenId, metadata]
                const [tokenId, metadata] = nft;
                
                // Parsear metadatos de colección de manera segura
                let collectionMeta = {};
                try {
                  if (collectionMetadata && collectionMetadata !== 'undefined' && typeof collectionMetadata === 'string') {
                    collectionMeta = JSON.parse(collectionMetadata);
                  } else if (Array.isArray(collectionMetadata) && collectionMetadata.length > 0) {
                    // Si collectionMetadata es un array, tomar el primer elemento
                    const metaString = collectionMetadata[0];
                    if (metaString && metaString !== 'undefined' && typeof metaString === 'string') {
                      collectionMeta = JSON.parse(metaString);
                    }
                  }
                } catch (metaError) {
                  console.log(`⚠️ Error parseando metadatos de colección:`, metaError);
                  collectionMeta = { description: "Colección sin metadatos" };
                }

                // Procesar tokenId de manera segura
                let tokenIdStr = null;
                if (typeof tokenId === 'object' && tokenId !== null) {
                  if (tokenId.toText && typeof tokenId.toText === 'function') {
                    tokenIdStr = tokenId.toText();
                  } else if (tokenId.__principal__) {
                    tokenIdStr = tokenId.__principal__;
                  } else if (typeof tokenId === 'string') {
                    tokenIdStr = tokenId;
                  } else {
                    // Si es un objeto complejo, convertir a string
                    tokenIdStr = JSON.stringify(tokenId);
                  }
                } else if (typeof tokenId === 'string') {
                  tokenIdStr = tokenId;
                } else {
                  tokenIdStr = String(tokenId);
                }

                console.log(`🏷️ Token ID procesado:`, tokenIdStr);

                // Parsear metadatos del NFT
                let nftMetadata = {};
                if (metadata && metadata.nonfungible && metadata.nonfungible.metadata && metadata.nonfungible.metadata.length > 0) {
                  try {
                    nftMetadata = JSON.parse(metadata.nonfungible.metadata[0].json);
                  } catch (nftMetaError) {
                    console.log(`⚠️ Error parseando metadatos del NFT:`, nftMetaError);
                    nftMetadata = { name: "NFT sin metadatos" };
                  }
                }

                // Obtener URL de imagen de manera segura
                const imageUrl = nftMetadata.imageUrl || collectionMeta.imageUrl;
                const finalImageUrl = imageUrl ? getImageUrl(imageUrl) : "/assets/images/business-model-1.png";

                // Procesar título de manera segura - extraer solo el nombre de la feria
                let finalTitle = "NFT sin título";
                if (nftMetadata.name) {
                  finalTitle = nftMetadata.name;
                } else if (Array.isArray(collectionName) && collectionName.length >= 3) {
                  // collectionName es un array [timestamp, canisterId, "Feria: nombre", symbol, metadata]
                  // Extraer solo el nombre de la feria del índice 2
                  const fairName = collectionName[2];
                  if (typeof fairName === 'string' && fairName.startsWith('Feria: ')) {
                    finalTitle = fairName.replace('Feria: ', '');
                  } else {
                    finalTitle = String(fairName);
                  }
                } else if (typeof collectionName === 'string') {
                  finalTitle = collectionName;
                }

                const nftData = {
                  id: tokenIdStr,
                  title: finalTitle,
                  description: collectionMeta.sector || "General", // Mostrar el sector en lugar de descripción
                  image: finalImageUrl,
                  organizer: nftMetadata.organizer || collectionMeta.createdBy || "Organizador desconocido",
                  button: "VER PRODUCTOS",
                  collectionId: canisterIdStr,
                  tokenIndex: tokenIdStr,
                  sector: collectionMeta.sector || "General",
                  subSector: collectionMeta.subSector || "N/A"
                };

                allNFTs.push(nftData);
                console.log(`✅ NFT procesado exitosamente:`, nftData);

              } catch (error) {
                console.log(`❌ Error procesando NFT:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Error obteniendo NFTs de colección ${collectionName}:`, error);
        }
      }

      console.log("🎨 NFTs procesados:", allNFTs);
      setUserNFTs(allNFTs);
      
    } catch (error) {
      console.error("❌ Error cargando NFTs del usuario:", error);
      setUserNFTs([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar NFTs del usuario en su wallet
  const checkUserWalletNFTs = async () => {
    if (!principal) return;

    try {
      console.log("🔍 Verificando NFTs en wallet del usuario:", principal);
      const { begodsBackendActor } = await createAuthenticatedActors();
      
      // Obtener colecciones del usuario
      const userCollections = await begodsBackendActor.getUserCollectionDetails();
      console.log("👤 Colecciones del usuario:", userCollections);
      
      if (userCollections && userCollections.length > 0) {
        for (const [timestamp, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata] of userCollections) {
          // El collectionCanisterId viene como un array con formato: [timestamp, canisterId, name, symbol, metadata]
          // Necesitamos extraer el canisterId que está en la posición 1
          let canisterIdStr = null;
          let canisterIdObject = null;
          
          if (Array.isArray(collectionCanisterId) && collectionCanisterId.length >= 2) {
            // Extraer el canister ID del array (posición 1)
            canisterIdObject = collectionCanisterId[1];
            
            if (typeof canisterIdObject === 'object' && canisterIdObject.__principal__) {
              canisterIdStr = canisterIdObject.__principal__;
            } else if (typeof canisterIdObject === 'object' && canisterIdObject.toText) {
              canisterIdStr = canisterIdObject.toText();
            } else if (typeof canisterIdObject === 'string') {
              canisterIdStr = canisterIdObject;
            } else {
              console.log(`❌ Formato de canister ID no reconocido en debug:`, canisterIdObject);
              continue;
            }
          } else {
            console.log(`❌ collectionCanisterId no es un array válido en debug:`, collectionCanisterId);
            continue;
          }

          console.log(`🏛️ Revisando colección: ${collectionName} (${canisterIdStr})`);
          
          // Usar el objeto Principal original en lugar del string
          const nftsResponse = await begodsBackendActor.getAllCollectionNFTs(canisterIdObject, 50, 0);
          
          if (nftsResponse.ok && nftsResponse.ok.data.length > 0) {
            console.log(`📦 NFTs en colección ${collectionName}:`);
            
            for (const [tokenIndex, accountId, metadata, price] of nftsResponse.ok.data) {
              console.log(`  🎨 NFT #${tokenIndex}:`);
              console.log(`    👤 Owner: ${accountId}`);
              console.log(`    🆔 Tu Principal: ${principal}`);
              console.log(`    ✅ Es tuyo: ${accountId === principal ? "SÍ" : "NO"}`);
              console.log(`    📝 Nombre: ${metadata.nonfungible?.name || "Sin nombre"}`);
              console.log(`    💰 Precio: ${price || "Sin precio"}`);
              
              if (metadata.nonfungible?.metadata && metadata.nonfungible.metadata.length > 0) {
                try {
                  const nftMetadata = JSON.parse(metadata.nonfungible.metadata[0].json);
                  console.log(`    🖼️ Imagen ID: ${nftMetadata.imageUrl || "Sin imagen"}`);
                } catch (e) {
                  console.log(`    ❌ Error parseando metadatos: ${e.message}`);
                }
              }
            }
          }
        }
      } else {
        console.log("📭 No se encontraron colecciones para el usuario");
      }
    } catch (error) {
      console.error("❌ Error verificando NFTs del usuario:", error);
    }
  };

  // Función para verificar NFTs en Plug Wallet
  const checkPlugWalletNFTs = async () => {
    if (!window.ic?.plug) {
      console.log("❌ Plug Wallet no está disponible");
      return;
    }

    try {
      console.log("🔌 Verificando NFTs en Plug Wallet...");
      
      // Verificar si está conectado
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        console.log("❌ Plug Wallet no está conectado");
        return;
      }

      // Obtener el principal del usuario
      const plugPrincipal = await window.ic.plug.agent.getPrincipal();
      console.log("🆔 Principal de Plug:", plugPrincipal.toString());

      // Obtener tokens NFT del usuario
      try {
        const tokens = await window.ic.plug.requestConnect({
          whitelist: [],
          host: window.location.origin,
        });
        console.log("🎨 Tokens en Plug Wallet:", tokens);
      } catch (plugError) {
        console.log("⚠️ Error obteniendo tokens de Plug:", plugError);
      }

      // También verificar las colecciones desde nuestro backend
      const { begodsBackendActor } = await createAuthenticatedActors();
      const userCollections = await begodsBackendActor.getUserCollectionDetails();
      
      console.log("📚 Colecciones desde backend para Plug:", userCollections);
      
      if (userCollections && userCollections.length > 0) {
        for (const collection of userCollections) {
          const [timestamp, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata] = collection;
          
          let canisterIdStr = collectionCanisterId;
          if (Array.isArray(collectionCanisterId) && collectionCanisterId.length >= 2) {
            const canisterIdObject = collectionCanisterId[1];
            if (typeof canisterIdObject === 'object' && canisterIdObject.toText) {
              canisterIdStr = canisterIdObject.toText();
            } else if (typeof canisterIdObject === 'object' && canisterIdObject.__principal__) {
              canisterIdStr = canisterIdObject.__principal__;
            }
          }
          
          console.log(`🏛️ Colección en Plug: ${collectionName} (${canisterIdStr})`);
        }
      }

    } catch (error) {
      console.log("❌ Error verificando Plug Wallet:", error);
    }
  };

  // Cargar NFTs al montar el componente
  useEffect(() => {
    if (principal) {
      loadUserNFTs();
    } else {
      setLoading(false);
    }
  }, [principal]);

  return (
    <>
      <h1 className="dashboard-title">EVENTOS Y HUBS</h1>
      <p className="dashboard-subtitle">Selecciona tu evento virtual</p>
      
      {/* Botón de debug (temporal) */}
      <div style={{marginBottom: '1rem', textAlign: 'center'}}>
        <button 
          onClick={checkUserWalletNFTs}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🔍 Debug: Verificar NFTs en Wallet
        </button>
        <button 
          onClick={checkPlugWalletNFTs}
          style={{
            padding: '8px 16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔌 Debug: Verificar Plug Wallet
        </button>
      </div>
      
      {!showForm ? (
        <div className="nft-cards-row" style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
          {/* Botón para crear nuevo NFT */}
          <div className="nft-card mint-card" style={{minWidth:280,maxWidth:320,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',border:'2px solid #00d4ff',borderRadius:20,padding:'2rem',background:'rgba(0,0,0,0.15)'}} onClick={handleMintClick}>
            <div style={{fontWeight:700,fontSize:'1.2rem',color:'#cfd8ff',marginBottom:'1rem'}}>MINTEAR NFT</div>
            <div style={{width:90,height:90,background:'linear-gradient(135deg,#00d4ff,#007bff)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.5rem'}}>
              <span style={{fontSize:60,color:'#fff',fontWeight:900}}>+</span>
            </div>
            <div style={{fontWeight:900,fontSize:'1.3rem',color:'#fff'}}>CREA TU FERIA</div>
          </div>

          {/* Mostrar loading o NFTs */}
          {loading ? (
            <div style={{minWidth:280,maxWidth:320,border:'2px solid #00d4ff',borderRadius:20,padding:'1.5rem',background:'rgba(0,0,0,0.10)',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{color:'#b8c5d6'}}>Cargando NFTs...</div>
            </div>
          ) : userNFTs.length > 0 ? (
            userNFTs.map((nft, i) => (
              <div key={i} className="nft-card" style={{minWidth:280,maxWidth:320,border:'2px solid #00d4ff',borderRadius:20,padding:'1.5rem',background:'rgba(0,0,0,0.10)',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <img 
                  src={nft.image} 
                  alt={nft.title} 
                  style={{width:'100%',borderRadius:12,marginBottom:'1rem',objectFit:'cover',maxHeight:120}}
                  onError={(e) => {
                    e.target.src = "/assets/images/business-model-1.png"; // Imagen fallback
                  }}
                />
                <div style={{fontWeight:900,fontSize:'1.1rem',color:'#fff',marginBottom:4}}>{nft.title}</div>
                <div style={{fontWeight:700,fontSize:'1rem',color:'#b8c5d6',marginBottom:4}}>{nft.subtitle}</div>
                <div style={{fontSize:'0.95rem',color:'#b8c5d6',marginBottom:8}}>{nft.description}</div>
                <div style={{fontSize:'0.8rem',color:'#888',marginBottom:12}}>{nft.sector} - {nft.subSector}</div>
                <button className="btn btn-info w-100" style={{background:'#00d4ff',color:'#181c2f',fontWeight:700,borderRadius:20}}>{nft.button}</button>
              </div>
            ))
          ) : (
            <div style={{minWidth:280,maxWidth:320,border:'2px solid #666',borderRadius:20,padding:'1.5rem',background:'rgba(0,0,0,0.05)',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{color:'#888',textAlign:'center'}}>
                <div style={{marginBottom:'1rem'}}>📭</div>
                <div>No tienes NFTs aún</div>
                <div style={{fontSize:'0.9rem',marginTop:'0.5rem'}}>¡Crea tu primera feria virtual!</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <CreateVirtualFair onCancel={handleFormClose} onSuccess={handleFormClose} />
        </div>
      )}
    </>
  );
};

export default DashboardHome; 