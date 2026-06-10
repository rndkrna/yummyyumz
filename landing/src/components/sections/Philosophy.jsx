import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const marqueeRef = useRef(null);
  const statementRef = useRef(null);
  const sectionRef = useRef(null);
  
  const text = "INI YUMMY YUMZ. KAMI BIKIN KUE BENTO BAHKAN UNTUK MEREKA YANG GAK SUKA MANIS SAMA SEKALI.";
  const words = text.split(" ");

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Infinite Marquee animation
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 15,
        ease: "none",
        repeat: -1
      });

      // Words reveal (color fill from bottom)
      const wordElements = statementRef.current.querySelectorAll('.word');
      
      gsap.fromTo(wordElements, 
        { color: 'rgba(74, 62, 61, 0.2)' },
        {
          color: '#4A3E3D',
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="proses" ref={sectionRef} className="relative z-10 -mt-8 pt-8 bg-bakeryPeach rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden">
      
      {/* Brand Statement / Big Text Reading Reveal */}
      <div className="pt-24 pb-16 px-8 md:px-16 max-w-7xl mx-auto flex justify-center">
        <h2 
          ref={statementRef}
          className="font-display font-extrabold text-[clamp(2.5rem,6vw,6rem)] text-center leading-[0.95] max-w-6xl tracking-tighter uppercase"
        >
          {words.map((word, idx) => (
            <span key={idx} className="word inline-block mr-[0.2em] mb-2">
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* Marquee Arch Container */}
      <div className="bg-bakeryBerry border-y-4 border-bakeryText mt-12 transform -rotate-2 scale-110 overflow-hidden shadow-[0_10px_0_rgba(74,62,61,1)]">
        <div ref={marqueeRef} className="flex whitespace-nowrap w-max items-center">
          {/* Content repeated 2x */}
          <div className="font-display font-extrabold uppercase text-bakeryBg text-[clamp(4rem,10vw,8rem)] leading-none px-4 py-2 tracking-tighter">
            * KUALITAS PREMIUM * RASA YANG BIKIN KANGEN 
          </div>
          <div className="font-display font-extrabold uppercase text-bakeryBg text-[clamp(4rem,10vw,8rem)] leading-none px-4 py-2 tracking-tighter">
            * KUALITAS PREMIUM * RASA YANG BIKIN KANGEN 
          </div>
        </div>
      </div>

    </section>
  );
}
