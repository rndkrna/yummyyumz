import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imgRightRef = useRef(null);
  const imgLeftRef = useRef(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax effects for images
      gsap.to(imgLeftRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(imgRightRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      
      // Text reveal
      gsap.from(textRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full bg-bakeryBerry pb-20 overflow-hidden"
    >
      {/* Content wrapper */}
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 pt-16 pb-32">
        
        {/* Top Left Image (floating parallax) */}
        <div className="hidden md:block absolute -top-10 left-0 w-[25%] h-[50vh] z-0">
          <div 
            ref={imgLeftRef} 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-br-3xl opacity-80" 
          />
        </div>
        
        {/* Text Content (Center/Left) */}
        <div ref={textRef} className="col-span-1 md:col-span-6 md:col-start-3 z-10 flex flex-col justify-center">
          <h2 className="font-display font-bold text-white uppercase text-[clamp(2rem,4vw,4rem)] leading-[0.95] tracking-tight mb-6">
            YANG SUDAH COBA PASTI TAHU. YANG BELUM - BERSIAPLAH UNTUK SENSASI RASA YANG BIKIN KETAGIHAN
          </h2>
          
          <p className="font-body text-white/90 text-sm md:text-base leading-relaxed mb-4 font-medium max-w-xl">
            Tujuan kami bukan sekadar membuat kue bento yang lucu. Itu terlalu biasa. Kami ingin Anda merasakan sesuatu yang spesial saat menggigit kue kami. Agak sulit memang, tapi kami mewujudkannya.
          </p>
          <p className="font-body text-white/90 text-sm md:text-base leading-relaxed mb-8 font-medium max-w-xl">
            Bagaimana caranya? Kami tidak mentolerir jalan pintas: baik dalam rasa, bahan baku, maupun produksi. Kami mencari cokelat terbaik, cream cheese paling lembut, dan selai buah asli agar setiap gigitan terasa sempurna.
          </p>

          <div className="flex items-center space-x-6">
            <Link 
              to="/about"
              data-cursor-hover
              className="relative w-20 h-20 flex items-center justify-center group"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-white/40 group-hover:text-white transition-colors duration-300 transform group-hover:scale-105">
                 <path fill="transparent" stroke="currentColor" strokeWidth="1.5" d="M 50 5 C 60 5, 65 15, 75 15 C 85 15, 90 25, 95 35 C 95 45, 85 50, 85 60 C 85 70, 95 75, 95 85 C 90 95, 80 95, 70 95 C 60 95, 55 85, 45 85 C 35 85, 30 95, 20 95 C 10 95, 5 85, 5 75 C 5 65, 15 60, 15 50 C 15 40, 5 35, 5 25 C 10 15, 20 15, 30 15 C 40 15, 45 5, 50 5 Z"/>
              </svg>
              <span className="text-white font-light text-xl relative z-10 transition-transform group-hover:translate-x-2">→</span>
            </Link>
            
            <span className="font-display font-bold text-white uppercase tracking-widest text-sm">
              ABOUT US
            </span>
          </div>
        </div>

        {/* Right Image (Tall vertical image with rounded top-right) */}
        <div className="col-span-1 md:col-span-4 h-[50vh] md:h-[75vh] relative mt-12 md:mt-0 z-0">
          <div 
            ref={imgRightRef} 
            className="absolute inset-0 w-full h-[110%] -top-[5%] bg-[url('https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-tr-[80px]" 
          />
        </div>
      </div>
    </section>
  );
}
