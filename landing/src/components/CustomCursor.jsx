import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [hoverText, setHoverText] = useState("");

  useEffect(() => {
    document.body.style.cursor = "none";

    // Center elements based on their transforms
    gsap.set(cursorRingRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorDotRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorTextRef.current, { xPercent: -50, yPercent: -50 });

    // Smooth cursor following with different speeds for layered effect
    const xToRing = gsap.quickTo(cursorRingRef.current, "x", {
      duration: 0.3,
      ease: "expo.out",
    });
    const yToRing = gsap.quickTo(cursorRingRef.current, "y", {
      duration: 0.3,
      ease: "expo.out",
    });

    const xToDot = gsap.quickTo(cursorDotRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yToDot = gsap.quickTo(cursorDotRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });

    const xToText = gsap.quickTo(cursorTextRef.current, "x", {
      duration: 0.2,
      ease: "power3",
    });
    const yToText = gsap.quickTo(cursorTextRef.current, "y", {
      duration: 0.2,
      ease: "power3",
    });

    const onMouseMove = (e) => {
      xToRing(e.clientX);
      yToRing(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToText(e.clientX);
      yToText(e.clientY);
    };

    const handleMouseOver = (e) => {
      const hoverTarget = e.target.closest("[data-cursor-hover]");
      const magneticTarget = e.target.closest("[data-magnetic]");

      if (hoverTarget) {
        setHoverText(hoverTarget.getAttribute("data-cursor-text") || "VIEW");
        gsap.to(cursorRingRef.current, {
          scale: 2,
          borderColor: "#A61C3C",
          borderWidth: 3,
          duration: 0.4,
          ease: "expo.out",
        });
        gsap.to(cursorDotRef.current, { scale: 0, duration: 0.3 });
      } else {
        setHoverText("");
        gsap.to(cursorRingRef.current, {
          scale: 1,
          borderColor: "#A61C3C",
          borderWidth: 2,
          duration: 0.4,
          ease: "expo.out",
        });
        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.3 });
      }

      // Magnetic effect
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        gsap.to(magneticTarget, {
          x: deltaX,
          y: deltaY,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    const handleMouseLeave = (e) => {
      const magneticTarget = e.target.closest("[data-magnetic]");
      if (magneticTarget) {
        gsap.to(magneticTarget, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursorRingRef.current, { scale: 0.8, duration: 0.2 });
      gsap.to(cursorDotRef.current, { scale: 1.5, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(cursorRingRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorDotRef.current, { scale: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-12 h-12 border-2 border-bakeryBerry rounded-full pointer-events-none z-[9999] hidden md:block transition-colors"
        style={{
          mixBlendMode: "difference",
        }}
      />

      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-bakeryBerry rounded-full pointer-events-none z-[10000] hidden md:block"
      />

      {/* Hover Text */}
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] hidden md:flex items-center justify-center"
      >
        <span
          className="font-display font-bold text-xs text-white bg-bakeryBerry px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-300"
          style={{
            opacity: hoverText ? 1 : 0,
            transform: `scale(${hoverText ? 1 : 0.5}) translateY(${hoverText ? "-40px" : "-30px"})`,
          }}
        >
          {hoverText}
        </span>
      </div>
    </>
  );
}
