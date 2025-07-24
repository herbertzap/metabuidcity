import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { createAuthenticatedActors } from "../utils/begodsActors";
import { Principal } from "@dfinity/principal";

// Simulación de datos de usuario (en producción, obtén del backend)
const mockUserData = {
  username: "",
  email: "",
};

const UserProfile = () => {
  const { principal } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos reales del usuario al cargar
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const { begodsBackendActor } = await createAuthenticatedActors();
        const result = await begodsBackendActor.getUserDetails(Principal.fromText(principal));
        // El resultado puede ser un variant Ok/Error, adaptamos:
        if (result && result.ok) {
          setUserData({ username: result.ok[1] || "", email: result.ok[2] || "" });
        } else {
          setUserData({ username: "", email: "" });
        }
      } catch (e) {
        setError("No se pudo obtener el perfil");
      }
      setLoading(false);
    };
    if (principal) fetchUser();
  }, [principal]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { begodsBackendActor } = await createAuthenticatedActors();
      // updateUserDetails(principal, nombre, email, avatar, opt blob)
      await begodsBackendActor.updateUserDetails(
        Principal.fromText(principal),
        userData.username,
        userData.email || "",
        "",
        []
      );
      setEditMode(false);
    } catch (e) {
      setError("No se pudo guardar el perfil");
    }
    setSaving(false);
  };

  if (loading) return <div style={{color:'#fff'}}>Cargando perfil...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div style={{maxWidth: 500, margin: "0 auto", background: "rgba(10,14,39,0.95)", borderRadius: 16, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.2)"}}>
      <h2 style={{color: "#fff", fontWeight: 900, marginBottom: 24}}>Perfil de Usuario</h2>
      <div style={{marginBottom: 18}}>
        <label style={{color: "#b8c5d6", fontWeight: 600}}>Principal:</label>
        <div style={{color: "#00d4ff", fontFamily: "monospace", fontSize: 14, wordBreak: "break-all"}}>{principal}</div>
      </div>
      <div style={{marginBottom: 18}}>
        <label style={{color: "#b8c5d6", fontWeight: 600}}>Nombre de usuario:</label>
        {editMode ? (
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="form-control"
            style={{marginTop: 6, marginBottom: 6}}
            placeholder="Tu nombre de usuario"
          />
        ) : (
          <div style={{color: "#fff", fontWeight: 700, fontSize: 16}}>{userData.username || <span style={{color:'#b8c5d6'}}>No definido</span>}</div>
        )}
      </div>
      {/* Puedes agregar más campos aquí, como email, avatar, etc. */}
      <div className="d-flex gap-2 mt-4">
        {editMode ? (
          <>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button className="btn btn-secondary" onClick={handleCancel} disabled={saving}>Cancelar</button>
          </>
        ) : (
          <button className="btn btn-outline-info" onClick={handleEdit}>Editar perfil</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 