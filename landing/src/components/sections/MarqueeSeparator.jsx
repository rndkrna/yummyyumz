import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MarqueeSeparator() {
  const marqueeRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 15,
        ease: "none",
        repeat: -1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-32 bg-bakeryBerry flex items-center justify-center z-30">
      <div className="absolute w-[110%] bg-bakeryBerry border-y-4 border-bakeryBg transform -rotate-2 overflow-hidden shadow-[0_10px_0_rgba(74,62,61,0.15)]">
        <div ref={marqueeRef} className="flex whitespace-nowrap w-max items-center">
          <div className="font-display font-extrabold uppercase text-bakeryBg text-[clamp(3rem,8vw,6rem)] leading-none px-4 py-2 tracking-tighter">
            * KUALITAS PREMIUM * RASA YANG BIKIN KANGEN 
          </div>
          <div className="font-display font-extrabold uppercase text-bakeryBg text-[clamp(3rem,8vw,6rem)] leading-none px-4 py-2 tracking-tighter">
            * KUALITAS PREMIUM * RASA YANG BIKIN KANGEN 
          </div>
          <div className="font-display font-extrabold uppercase text-bakeryBg text-[clamp(3rem,8vw,6rem)] leading-none px-4 py-2 tracking-tighter">
            * KUALITAS PREMIUM * RASA YANG BIKIN KANGEN 
          </div>
        </div>
      </div>
    </div>
  );
}
