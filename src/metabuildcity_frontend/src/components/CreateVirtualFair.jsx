import React, { useState } from "react";
import "./CreateVirtualFair.scss";
import { createAuthenticatedActors } from '../utils/begodsActors';
import { useAuth } from '../utils/AuthContext';
import { Principal } from '@dfinity/principal';

const CreateVirtualFair = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    fairName: "",
    organizerName: "",
    sector: "Fintech",
    subSector: "Digital banking",
    walletId: "",
    media: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { principal, checkPlugNFTs, requestNFTApproval } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fileToUint8Array = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Validación básica
      if (!formData.media) {
        alert("Por favor selecciona una imagen o video.");
        setLoading(false);
        return;
      }

      // Validación adicional del archivo
      const file = formData.media;
      console.log("📁 Archivo seleccionado:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Verificar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("El archivo es muy grande. Máximo 10MB permitido.");
        setLoading(false);
        return;
      }

      // Verificar tipo de archivo
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert("Por favor selecciona una imagen o video válido.");
        setLoading(false);
        return;
      }

      // 2. Crear actores autenticados
      const { begodsBackendActor, begodsAssetHandlerActor } = await createAuthenticatedActors();

      // 3. Generar un ImgId único
      const imgId = formData.fairName.replace(/\s+/g, "_") + "_" + Date.now();

      // 4. Convertir archivo a Uint8Array
      const imgBytes = await fileToUint8Array(file);
      console.log("🔢 Bytes convertidos:", {
        length: imgBytes.length,
        firstBytes: Array.from(imgBytes.slice(0, 10)),
        lastBytes: Array.from(imgBytes.slice(-10))
      });

      // 5. Subir imagen al assethandler
      try {
        console.log("🖼️ Subiendo imagen con ID:", imgId);
        console.log("📊 Tamaño de imagen:", imgBytes.length, "bytes");
        await begodsAssetHandlerActor.uploadImg(imgId, imgBytes);
        console.log("✅ Imagen subida exitosamente");
      } catch (error) {
        console.error("❌ Error al subir imagen:", error);
        throw new Error(`Error al subir imagen: ${error.message || error}`);
      }

      // 6. Crear usuario primero (si no existe)
      const userPrincipal = Principal.fromText(principal);
      try {
        await begodsBackendActor.create_user(userPrincipal, formData.organizerName);
        console.log("Usuario creado o ya existía");
      } catch (error) {
        console.log("Error al crear usuario (puede que ya exista):", error);
      }

      // 7. Crear una colección primero
      console.log("🏗️ Creando colección...");
      const collectionMetadata = JSON.stringify({
        description: `Colección para la feria virtual: ${formData.fairName}`,
        sector: formData.sector,
        subSector: formData.subSector,
        createdBy: formData.organizerName,
        imageUrl: imgId
      });

      const [creatorPrincipal, collectionCanisterId] = await begodsBackendActor.createExtCollection(
        `Feria: ${formData.fairName}`, // nombre de la colección
        "FAIR", // símbolo
        collectionMetadata // metadatos de la colección
      );

      console.log("✅ Colección creada:", {
        creator: creatorPrincipal.toText(),
        canisterId: collectionCanisterId.toText()
      });

      // 8. Preparar metadatos del NFT como JSON
      const nftMetadata = {
        fairName: formData.fairName,
        organizerName: formData.organizerName,
        sector: formData.sector,
        subSector: formData.subSector,
        imageUrl: imgId,
        createdAt: new Date().toISOString()
      };

      // 9. Mintear el NFT en la colección creada
      console.log("🎭 Minteando NFT en la colección...");
      const result = await begodsBackendActor.mintExtNonFungible(
        collectionCanisterId, // ✅ CORRECTO: Usar el canister de la colección
        formData.fairName, // name
        "NFT creado desde metabuildcity", // description
        imgId, // asset (ImgId)
        imgId, // thumbnail (puedes usar el mismo ImgId)
        [{ json: JSON.stringify(nftMetadata) }], // MetadataContainer como opt (array de 1)
        1 // supply
      );

      console.log("✅ NFT minteado exitosamente:", result);
      
      // 10. Extraer información del NFT creado
      if (result && result.length > 0) {
        const [tokenIndex, tokenIdentifier] = result[0];
        console.log("🎯 NFT creado:", {
          tokenIndex: tokenIndex.toString(),
          tokenIdentifier: tokenIdentifier,
          collectionCanister: collectionCanisterId.toText()
        });

        // 11. Si está usando Plug Wallet, solicitar aprobación para transferir el NFT
        if (window.ic?.plug) {
          try {
            console.log("🔌 Solicitando aprobación de Plug Wallet para NFT...");
            
            // Crear la información del NFT para Plug
            const nftInfo = {
              canisterId: collectionCanisterId.toText(),
              tokenIdentifier: tokenIdentifier,
              tokenIndex: tokenIndex,
              metadata: {
                name: formData.fairName,
                description: "NFT creado desde metabuildcity",
                image: `https://frmde-4yaaa-aaaam-aenlq-cai.raw.icp0.io/?imgid=${imgId}`,
                attributes: [
                  { trait_type: "Organizer", value: formData.organizerName },
                  { trait_type: "Sector", value: formData.sector },
                  { trait_type: "Sub-Sector", value: formData.subSector }
                ]
              }
            };

            console.log("📋 Información del NFT para Plug:", nftInfo);
            
            // Intentar solicitar aprobación de NFT
            try {
              console.log("🔄 Solicitando aprobación de wallet...");
              await requestNFTApproval(nftInfo);
              console.log("✅ Aprobación recibida exitosamente");
            } catch (approvalError) {
              console.log("⚠️ Error en aprobación (puede ser normal):", approvalError);
              // La aprobación puede fallar por varios motivos, pero el NFT ya está creado
            }

            // Verificar NFTs en Plug después de un momento
            setTimeout(async () => {
              try {
                console.log("🔍 Verificando NFTs en Plug Wallet...");
                const plugNFTs = await checkPlugNFTs();
                console.log("🎨 NFTs encontrados en Plug:", plugNFTs);
              } catch (checkError) {
                console.log("⚠️ Error verificando NFTs en Plug:", checkError);
              }
            }, 3000); // Esperar 3 segundos
            
            // Mostrar información del contrato NFT generado
            alert(`🎉 ¡NFT Creado Exitosamente!

📄 CONTRATO NFT GENERADO:
• Token ID: ${tokenIdentifier}
• Colección: ${collectionCanisterId.toText()}
• Nombre: ${formData.fairName}
• Estándar: EXT NFT

🔌 INTEGRACIÓN CON PLUG WALLET:
• El NFT se ha creado en la blockchain
• Puede tardar unos minutos en aparecer en tu wallet
• Si no aparece, refresca Plug Wallet
• Puedes verificar el NFT usando el Token ID

💡 TIP: Ve a tu Plug Wallet > NFTs para ver tu nueva colección.`);

          } catch (plugError) {
            console.log("⚠️ Error con Plug Wallet:", plugError);
            // Continuar sin error crítico - mostrar info básica
            alert(`🎉 ¡NFT Creado Exitosamente!

📄 CONTRATO NFT GENERADO:
• Token ID: ${tokenIdentifier}
• Colección: ${collectionCanisterId.toText()}
• Nombre: ${formData.fairName}
• Estándar: EXT NFT

⚠️ Nota: Hubo un problema con la integración de Plug Wallet,
pero tu NFT se creó correctamente en la blockchain.`);
          }
        } else {
          // Para otras wallets, mostrar información del contrato
          alert(`🎉 ¡NFT Creado Exitosamente!

📄 CONTRATO NFT GENERADO:
• Token ID: ${tokenIdentifier}
• Colección: ${collectionCanisterId.toText()}
• Nombre: ${formData.fairName}
• Estándar: EXT NFT

Para ver tu NFT, puedes usar el Token ID en cualquier explorador de NFTs de ICP.`);
        }
      }
      
      setSubmitted(true);
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000); // Esperar 2 segundos para mostrar el mensaje de éxito
      }
    } catch (error) {
      console.error("❌ Error al crear el NFT:", error);
      console.error("📋 Detalles del error:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert("Error al crear el NFT: " + (error.message || error));
    }
    setLoading(false);
  };

  return (
    <div className="create-virtual-fair">
      <h2>Create virtual fair</h2>
      {submitted ? (
        <p className="success-message">¡Gracias! Tu NFT ha sido creado correctamente.</p>
      ) : (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Fair name</label>
              <input
                type="text"
                name="fairName"
                value={formData.fairName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Organizer name</label>
              <input
                type="text"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
            <div className="form-group">
              <label>Sector</label>
              <select name="sector" value={formData.sector} onChange={handleChange}>
                <option value="Fintech">Fintech</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sub-sector</label>
              <select name="subSector" value={formData.subSector} onChange={handleChange}>
                <option value="Digital banking">Digital banking</option>
                <option value="Insurance">Insurance</option>
                <option value="Crypto">Crypto</option>
              </select>
            </div>
          </div>
            {/* Campo Wallet ID oculto - siempre usa el principal autenticado */}
  {/* <div className="form-group">
    <label>Wallet ID</label>
    <input
      type="text"
      name="walletId"
      value={formData.walletId}
      onChange={handleChange}
      required
    />
  </div> */}
          <div className="form-group upload-group">
          <label htmlFor="media">Upload image or video</label>
            <input
              type="file"
              name="media"
              accept="image/*,video/*"
              onChange={handleChange}
            />
          </div>
          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button type="submit" className="mint-btn" disabled={loading} style={{flex: 1}}>
              {loading ? "Creando NFT..." : "Mint NFT"}
            </button>
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel} 
                className="cancel-btn" 
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  border: '2px solid #666',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#b8c5d6',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateVirtualFair;