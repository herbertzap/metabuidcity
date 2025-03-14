import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import UnityApp from "./pages/UnityApp";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webgl" element={<UnityApp />} />
        </Routes>
    </Router>
  );
}

export default App;
