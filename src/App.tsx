import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import VirtualDressingRoom from "./pages/VirtualDressingRoom";
import AboutTeam from "./pages/AboutTeam";
import DemoSelection from "./pages/DemoSelection";
import ShopDemo from "./pages/ShopDemo";
import VirtualStyleCheck from "./pages/VirtualStyleCheck";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-dark)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<DemoSelection />} />
            <Route path="/shop-demo" element={<ShopDemo />} />
            <Route path="/try-on" element={<VirtualDressingRoom />} />
            <Route
              path="/virtual-style-check"
              element={<VirtualStyleCheck />}
            />
            <Route path="/about" element={<AboutTeam />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
