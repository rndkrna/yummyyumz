import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";

const FullCatalog = lazy(() => import("./pages/FullCatalog"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));

export default function App() {
  return (
    <div className="font-body min-h-screen overflow-x-hidden bg-bakeryBg text-bakeryText cursor-none selection:bg-bakeryBerry selection:text-white">
      <Router>
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          <PageTransition>
            <Suspense fallback={<div className="min-h-screen bg-bakeryBg" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<FullCatalog />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </SmoothScroll>
      </Router>
    </div>
  );
}
