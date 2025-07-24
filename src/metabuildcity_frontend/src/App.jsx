import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import React, { Suspense, lazy } from "react";
import MetabuildLanding from "./pages/MetabuildLanding";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Activos = lazy(() => import("./pages/Activos"));
const Stands = lazy(() => import("./pages/Stands"));
const Indicadores = lazy(() => import("./pages/Indicadores"));
const Retiros = lazy(() => import("./pages/Retiros"));
const Configuracion = lazy(() => import("./pages/Configuracion"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-5 text-light">Cargando vista...</div>}>
        <Routes>
          <Route path="/" element={<MetabuildLanding />} />
          <Route path="/home/*" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="activos" element={<Activos />} />
            <Route path="stands" element={<Stands />} />
            <Route path="indicadores" element={<Indicadores />} />
            <Route path="retiros" element={<Retiros />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="configuracion" element={<Configuracion />} />
            {/* Aquí puedes agregar más rutas hijas para el dashboard */}
          </Route>
          {/* Aquí puedes agregar nuevas rutas para futuras páginas del dashboard */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
