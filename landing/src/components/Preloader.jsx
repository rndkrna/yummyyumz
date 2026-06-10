import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const letterRef = useRef(null);
  const counterRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      // 1. Setup initial states
      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.set(letterRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.5,
        rotationY: -180,
      });

      gsap.set(counterRef.current, {
        opacity: 0,
        y: 20,
      });

      // 2. Counter animation
      tl.to(counterRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "expo.out",
      })
        .to(
          {},
          {
            duration: 2.5,
            onUpdate: function () {
              const p = Math.round(this.progress() * 100);
              setProgress(p);
            },
          },
        )

        // 3. Animate SVG Path Drawing
        .to(
          pathRef.current,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "expo.inOut",
          },
          "<",
        )
        .to(
          svgRef.current,
          {
            rotation: 360,
            duration: 2.5,
            ease: "expo.inOut",
          },
          "<",
        )

        // 4. Counter fade out, letter fade in
        .to(counterRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(
          svgRef.current,
          {
            scale: 0.7,
            opacity: 0.3,
            duration: 0.8,
            ease: "expo.out",
          },
          "<",
        )

        // 5. Animate 3D Letter with bounce
        .to(
          letterRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.6",
        )
        .to(
          letterRef.current,
          {
            rotationY: 360,
            duration: 1.5,
            ease: "none",
          },
          "-=0.2",
        )

        // 6. Explosive exit
        .to([letterRef.current, svgRef.current], {
          scale: 3,
          opacity: 0,
          duration: 0.8,
          ease: "expo.in",
        })
        .to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 1,
            ease: "expo.inOut",
          },
          "-=0.4",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-bakeryPeach via-bakeryBg to-bakeryPeach flex items-center justify-center overflow-hidden perspective-[1000px]"
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-2 h-2 bg-bakeryBerry rounded-full animate-float"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-bakeryBerry rounded-full animate-float"
          style={{ top: "60%", left: "80%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-bakeryBerry rounded-full animate-float"
          style={{ top: "80%", left: "20%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-bakeryBerry rounded-full animate-float"
          style={{ top: "30%", left: "70%", animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Progress Counter */}
      <div
        ref={counterRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center"
      >
        <div
          className="font-display font-black text-[clamp(4rem,12vw,10rem)] text-bakeryBerry"
          style={{ WebkitTextStroke: "2px #4A3E3D" }}
        >
          {progress}%
        </div>
        <div className="font-body text-bakeryText text-sm uppercase tracking-[0.3em] mt-4">
          Loading Sweetness
        </div>
      </div>

      {/* SVG Ring Animation */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="absolute w-[50vw] max-w-[500px] h-auto overflow-visible"
      >
        <path
          ref={pathRef}
          d="M 100 20 A 80 80 0 1 1 99.9 20"
          fill="none"
          stroke="#A61C3C"
          strokeWidth="6"
          strokeDasharray="10 10"
          strokeLinecap="round"
        />
        <path
          d="M 100 20 A 80 80 0 1 1 99.9 20"
          fill="none"
          stroke="#FCDAD1"
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>

      {/* 3D Letter 'Y' */}
      <div
        ref={letterRef}
        className="relative z-10 text-[clamp(12rem,25vw,24rem)] leading-none font-display font-black text-bakeryBerry drop-shadow-2xl"
        style={{
          textShadow:
            "8px 8px 0 #4A3E3D, 16px 16px 0 #FCDAD1, 24px 24px 40px rgba(0,0,0,0.3)",
          WebkitTextStroke: "3px white",
          transformStyle: "preserve-3d",
        }}
      >
        Y
      </div>
    </div>
  );
}
