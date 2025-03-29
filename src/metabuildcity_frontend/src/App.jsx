import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, lazy } from "react";

// 🔁 Importa las páginas de forma diferida (code-splitting)
const Home = lazy(() => import("./pages/Home"));
const UnityApp = lazy(() => import("./pages/UnityApp"));

function App() {
  return (
    <Router>
      <NavigationBar />
      <Suspense fallback={<div className="text-center mt-5 text-light">Cargando vista...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webgl" element={<UnityApp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
