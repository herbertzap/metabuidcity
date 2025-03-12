import React, { useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

const WebGLPage = () => {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: 'Build/webgl_export.loader.js',
    dataUrl: 'Build/webgl_export.data',
    frameworkUrl: 'Build/webgl_export.framework.js',
    codeUrl: 'Build/webgl_export.wasm',
  });

  useEffect(() => {
    if (isLoaded) {
      console.log('Unity WebGL cargado correctamente');
    }
  }, [isLoaded]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!isLoaded && (
        <p>Cargando aplicación... {Math.round(loadingProgression * 100)}%</p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: '960px', height: '600px', visibility: isLoaded ? 'visible' : 'hidden' }}
      />
    </div>
  );
};

export default WebGLPage;
