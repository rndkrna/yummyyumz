import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./smoothScrollContext";

gsap.registerPlugin(ScrollTrigger);

export default function PageTransition({ children }) {
  const location = useLocation();
  const lenis = useSmoothScroll();
  const pageRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRefs = useRef([]);
  const labelRef = useRef(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const overlay = overlayRef.current;
    const panels = panelRefs.current;
    const label = labelRef.current;

    if (!page || !overlay || !panels.length || !label) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      lenis?.scrollTo?.(0, { immediate: true });

      if (isFirstRender.current) {
        isFirstRender.current = false;

        gsap.set(overlay, { yPercent: -100, pointerEvents: "none" });
        gsap.set(panels, { yPercent: 0 });
        gsap.fromTo(
          page,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "transform",
            onComplete: () => ScrollTrigger.refresh(),
          },
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          gsap.set(overlay, { pointerEvents: "none" });
          ScrollTrigger.refresh();
        },
      });

      tl.set(overlay, { yPercent: 100, pointerEvents: "auto" })
        .set(panels, { yPercent: 100 })
        .set(label, { autoAlpha: 0, y: 30, scale: 0.95 })
        .to(overlay, { yPercent: 0, duration: 0.01 })
        .to(
          panels,
          {
            yPercent: 0,
            duration: 0.62,
            stagger: 0.08,
          },
          0,
        )
        .to(
          label,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.8)",
          },
          0.18,
        )
        .fromTo(
          page,
          { autoAlpha: 0, y: 36, scale: 0.975, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "expo.out",
            clearProps: "filter,transform",
          },
          0.62,
        )
        .to(
          label,
          {
            autoAlpha: 0,
            y: -24,
            scale: 1.05,
            duration: 0.35,
            ease: "power2.in",
          },
          0.85,
        )
        .to(
          panels,
          {
            yPercent: -100,
            duration: 0.74,
            stagger: 0.06,
          },
          0.98,
        )
        .to(overlay, { yPercent: -100, duration: 0.01 }, ">-0.01");
    }, pageRef);

    return () => ctx.revert();
  }, [location.pathname, lenis]);

  const setPanelRef = (element, index) => {
    if (element) {
      panelRefs.current[index] = element;
    }
  };

  return (
    <>
      <div ref={pageRef} key={location.pathname} className="relative z-0">
        {children}
      </div>

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden bg-bakeryBerry"
      >
        <div className="absolute inset-0 grid grid-cols-3">
          <div
            ref={(element) => setPanelRef(element, 0)}
            className="h-full bg-bakeryBerry"
          />
          <div
            ref={(element) => setPanelRef(element, 1)}
            className="h-full bg-[#f26f8f]"
          />
          <div
            ref={(element) => setPanelRef(element, 2)}
            className="h-full bg-bakeryPeach"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div ref={labelRef} className="relative">
            <div className="absolute -inset-8 rounded-full bg-white/15 blur-2xl" />
            <p className="relative font-body text-xs font-bold uppercase tracking-[0.45em] text-white/80 md:text-sm">
              YummyYumz
            </p>
            <h2 className="relative mt-4 font-display text-[clamp(3rem,10vw,9rem)] font-black uppercase leading-none tracking-tight text-white drop-shadow-2xl">
              Sweet Shift
            </h2>
            <div className="relative mx-auto mt-7 h-2 w-44 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full origin-left animate-[pageTransitionBar_1.1s_ease-in-out_infinite] rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
