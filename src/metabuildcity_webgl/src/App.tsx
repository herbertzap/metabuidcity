import { useEffect } from "react";

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const principal = urlParams.get("principal");

    if (principal) {
      localStorage.setItem("user_principal", principal);
      console.log("🔐 Principal recibido:", principal);
    } else {
      console.warn("⚠️ No se recibió principal. ¿Acceso directo?");
    }

    const canvas = document.getElementById("unity-canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      console.error("🎥 Canvas no encontrado");
      return;
    }

    const script = document.createElement("script");
    script.src = "/Build/mbf_webgl_gzip.loader.js";
    script.onload = () => {
      // @ts-ignore: Unity loader global
      createUnityInstance(canvas, {
        dataUrl: "/Build/mbf_webgl_gzip.data",
        frameworkUrl: "/Build/mbf_webgl_gzip.framework.js",
        codeUrl: "/Build/mbf_webgl_gzip.wasm",
      }).catch((e: unknown) => console.error("❌ Error al iniciar Unity:", e));
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#000" }}>
      <canvas id="unity-canvas" style={{ width: "100%", height: "100%" }}></canvas>
    </div>
  );
}

export default App;
