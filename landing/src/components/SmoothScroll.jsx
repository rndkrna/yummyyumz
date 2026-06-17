import { useEffect, useMemo } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollContext } from "./smoothScrollContext";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisInstance = useMemo(() => {
    if (typeof window === "undefined") return null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouchDevice) return null;

    return new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 0.9,
      infinite: false,
    });
  }, []);

  useEffect(() => {
    if (!lenisInstance) return undefined;

    const onTick = (time) => {
      lenisInstance.raf(time * 1000);
    };

    lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenisInstance.destroy();
    };
  }, [lenisInstance]);

  return (
    <SmoothScrollContext.Provider value={lenisInstance}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
