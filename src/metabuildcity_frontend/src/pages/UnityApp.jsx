import React, { useEffect } from "react";
import "../components/unityapp.scss"; // Asegúrate de que existe el archivo de estilos

const UnityApp = () => {
  useEffect(() => {
    // Función para habilitar el AudioContext después de una interacción
    const handleUserGesture = () => {
      if (typeof window.AudioContext !== "undefined") {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") {
          audioCtx.resume().then(() => {
            console.log("🎵 AudioContext reanudado después de la interacción del usuario.");
          });
        }
      }
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
    };

    // Agregar eventos para esperar la interacción del usuario
    document.addEventListener("click", handleUserGesture);
    document.addEventListener("keydown", handleUserGesture);

    // Cargar Unity WebGL
    const script = document.createElement("script");
    const unityCanvas = document.getElementById("unity-canvas");

    if (!unityCanvas) {
      console.error("⚠️ Canvas de WebGL no encontrado");
      return;
    }

    script.src = "/webgl/Build/mbf_webgl.loader.js"; // Nueva ruta a WebGL
    script.onload = () => {
      createUnityInstance(unityCanvas, {
        dataUrl: "/webgl/Build/mbf_webgl.data.gz",
        frameworkUrl: "/webgl/Build/mbf_webgl.framework.js.gz",
        codeUrl: "/webgl/Build/mbf_webgl.wasm.gz",
        streamingAssetsUrl: "/webgl/StreamingAssets",
        companyName: "DefaultCompany",
        productName: "MBF",
        productVersion: "1.0",
      }).catch((error) => {
        console.error("❌ Error al iniciar Unity WebGL:", error);
      });
    };

    document.body.appendChild(script);

    // Cleanup: Eliminar eventos cuando se desmonta el componente
    return () => {
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
    };
  }, []);

  return (
    <div id="unity-container">
      <canvas id="unity-canvas"></canvas>
    </div>
  );
};

export default UnityApp;
