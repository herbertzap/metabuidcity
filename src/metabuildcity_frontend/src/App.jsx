import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Marketplace from "./pages/Marketplace";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, lazy } from "react";

// 🔁 Importa las páginas de forma diferida (code-splitting)
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Router>
      <NavigationBar />
      <Suspense fallback={<div className="text-center mt-5 text-light">Cargando vista...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
