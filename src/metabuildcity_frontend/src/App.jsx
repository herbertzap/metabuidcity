import React from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: 'Build/webgl_export.loader.js',
    dataUrl: 'Build/webgl_export.data',
    frameworkUrl: 'Build/webgl_export.framework.js',
    codeUrl: 'Build/webgl_export.wasm',
  });
  return <Unity unityProvider={unityProvider} />;
}

export default App;
