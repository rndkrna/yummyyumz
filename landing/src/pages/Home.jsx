import { Suspense, lazy, useEffect, useState } from "react";
import Hero from "../components/sections/Hero";

const About = lazy(() => import("../components/sections/About"));
const MarqueeSeparator = lazy(
  () => import("../components/sections/MarqueeSeparator"),
);
const Catalog = lazy(() => import("../components/sections/Catalog"));
const DeliveryBox = lazy(() => import("../components/sections/DeliveryBox"));
const Footer = lazy(() => import("../components/sections/Footer"));

export default function Home() {
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(
        () => setShowDeferredSections(true),
        { timeout: 1800 },
      );
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(
      () => setShowDeferredSections(true),
      900,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <main>
        <Hero />
        {showDeferredSections ? (
          <Suspense fallback={null}>
            <About />
            <MarqueeSeparator />
            <Catalog />
            <DeliveryBox />
          </Suspense>
        ) : null}
      </main>
      {showDeferredSections ? (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      ) : null}
    </>
  );
}
