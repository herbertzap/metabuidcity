import React, { useState } from "react";
import nftActor from "../utils/nftActor";
import "./CreateVirtualFair.scss";
import { Principal } from "@dfinity/principal";

const CreateVirtualFair = () => {
  const [formData, setFormData] = useState({
    fairName: "",
    organizerName: "",
    sector: "Fintech",
    subSector: "Digital banking",
    walletId: "",
    media: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Subir imagen/video al storage canister (si hay archivo)
      let assetUrl = "";
      if (formData.media) {
        assetUrl = await subirAssetAlStorageCanister(formData.media); // Debes implementar esta función
      }

      // 2. Preparar metadatos
      const metadata = [
        ["Fair Name", { Text: formData.fairName }],
        ["Organizer Name", { Text: formData.organizerName }],
        ["Sector", { Text: formData.sector }],
        ["Sub-sector", { Text: formData.subSector }],
        ["Asset URL", { Text: assetUrl }],
      ];

      // 3. Convertir walletId a Principal
      const principal = Principal.fromText(formData.walletId);

      // 4. Llamar al método mint del canister estándar
      const tokenId = await nftActor.icrc7_mint({
        to: principal, // principal del destinatario
        metadata: [
          ["Fair Name", { Text: formData.fairName }],
          ["Organizer Name", { Text: formData.organizerName }],
          // ...otros metadatos
        ],
        // ...otros campos según el canister
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error al crear el NFT:", error);
    }
  };

  return (
    <div className="create-virtual-fair">
      <h2>Create virtual fair</h2>
      {submitted ? (
        <p className="success-message">¡Gracias! Tu NFT ha sido creado.</p>
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

  <div className="form-group">
    <label>Wallet ID</label>
    <input
      type="text"
      name="walletId"
      value={formData.walletId}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group upload-group">
    <label htmlFor="media">Upload image or video</label>
    <input
      type="file"
      name="media"
      accept="image/*,video/*"
      onChange={handleChange}
    />
  </div>

  <button type="submit" className="mint-btn">Mint NFT</button>
</form>

      )}
    </div>
  );
};

export default CreateVirtualFair;
