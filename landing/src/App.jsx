import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import FullCatalog from "./pages/FullCatalog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <div className="font-body min-h-screen overflow-x-hidden bg-bakeryBg text-bakeryText cursor-none selection:bg-bakeryBerry selection:text-white">
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}

      <Router>
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<FullCatalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </PageTransition>
        </SmoothScroll>
      </Router>
    </div>
  );
}
