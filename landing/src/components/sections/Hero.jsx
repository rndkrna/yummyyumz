import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const titleLeftRef = useRef(null);
  const textRightRef = useRef(null);

  const bgImageRef = useRef(null);
  const heroContentRef = useRef(null);
  const revealSceneRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Enhanced entrance animation - Stage 1: Impact Scene
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "expo.out", delay: 0.2 },
      );

      gsap.fromTo(
        titleLeftRef.current.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.6,
          stagger: 0.15,
          ease: "expo.out",
          delay: 0.5,
        },
      );

      gsap.fromTo(
        textRightRef.current,
        { opacity: 0, x: 40, y: 15 },
        { opacity: 1, x: 0, y: 0, duration: 1.4, delay: 1.2, ease: "expo.out" },
      );

      const heroMarquees = gsap.utils.toArray(".hero-marquee");

      gsap.set(
        [
          bgImageRef.current,
          heroContentRef.current,
          revealSceneRef.current,
          heroMarquees,
        ],
        {
          force3D: true,
          willChange: "transform, opacity",
        },
      );

      gsap.set(heroMarquees, { opacity: 0 });
      gsap.set(revealSceneRef.current, { opacity: 0, y: 34, scale: 0.98 });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      // Scroll effect: Stage 2 - Reveal Scene
      // Keep this as the single scroll-linked animation for the hero to avoid transform conflicts.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=90%" : "+=120%",
          scrub: isMobile ? 0.55 : 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Background shrinks into a featured card. On mobile it uses separate X/Y scale
      // so the final image stays wide enough instead of becoming a thin phone-shaped strip.
      tl.to(
        bgImageRef.current,
        {
          scale: isMobile ? 1 : 0.44,
          scaleX: isMobile ? 0.82 : 0.44,
          scaleY: isMobile ? 0.38 : 0.44,
          y: isMobile ? "-8vh" : "-2vh",
          opacity: 0.96,
          ease: "none",
        },
        0,
      );

      // Text elements fade and move up
      tl.to(
        heroContentRef.current,
        {
          y: isMobile ? "-20vh" : "-30vh",
          opacity: 0,
          ease: "none",
        },
        0,
      );

      tl.to(
        heroMarquees,
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
        },
        0.32,
      ).to(
        revealSceneRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
        },
        0.48,
      );

      // Hero giant text marquee animation
      heroMarquees.forEach((marquee, i) => {
        const direction = i % 2 === 0 ? -50 : 50;

        if (direction === 50) {
          gsap.set(marquee, { xPercent: -50 });
          gsap.to(marquee, {
            xPercent: 0,
            ease: "none",
            duration: 35 + i * 8,
            repeat: -1,
          });
        } else {
          gsap.to(marquee, {
            xPercent: -50,
            ease: "none",
            duration: 35 + i * 8,
            repeat: -1,
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-bakeryPeach via-bakeryBg to-bakeryBg transform-gpu"
    >
      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bakeryPeach/20 via-transparent to-bakeryBerry/10 opacity-60"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bakeryPeach rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-bakeryBerry rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Giant moving text behind the image (revealed when image shrinks) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-2 md:gap-4 overflow-hidden z-0 pointer-events-none mt-12">
        {/* Row 1 */}
        <div className="hero-marquee flex whitespace-nowrap w-max items-center">
          <h1 className="font-display font-bold uppercase text-bakeryBerry/30 text-[clamp(3rem,12vw,14rem)] leading-[0.9] tracking-tight px-4 drop-shadow-lg">
            INI YUMMY YUMZ. INI YUMMY YUMZ. INI YUMMY YUMZ. INI YUMMY YUMZ.
          </h1>
        </div>
        {/* Row 2 */}
        <div className="hero-marquee flex whitespace-nowrap w-max items-center">
          <h1 className="font-display font-bold uppercase text-bakeryBerry/25 text-[clamp(3rem,12vw,14rem)] leading-[0.9] tracking-tight px-4 drop-shadow-lg">
            KAMI BIKIN KUE BENTO BAHKAN KAMI BIKIN KUE BENTO BAHKAN KAMI BIKIN
            KUE BENTO BAHKAN
          </h1>
        </div>
        {/* Row 3 */}
        <div className="hero-marquee flex whitespace-nowrap w-max items-center">
          <h1 className="font-display font-bold uppercase text-bakeryBerry/30 text-[clamp(3rem,12vw,14rem)] leading-[0.9] tracking-tight px-4 drop-shadow-lg">
            UNTUK MEREKA YANG GAK UNTUK MEREKA YANG GAK UNTUK MEREKA YANG GAK
          </h1>
        </div>
        {/* Row 4 */}
        <div className="hero-marquee flex whitespace-nowrap w-max items-center">
          <h1 className="font-display font-bold uppercase text-bakeryBerry/25 text-[clamp(3rem,12vw,14rem)] leading-[0.9] tracking-tight px-4 drop-shadow-lg">
            SUKA MANIS SAMA SEKALI. SUKA MANIS SAMA SEKALI. SUKA MANIS SAMA
            SEKALI.
          </h1>
        </div>
      </div>

      {/* Background Image that shrinks */}
      <div
        ref={bgImageRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=75&w=1600&auto=format&fit=crop')] bg-cover bg-center origin-top z-10 shadow-2xl transform-gpu will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bakeryBerry/90 via-bakeryBerry/40 to-transparent rounded-inherit overflow-hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-bakeryBerry/70 via-transparent to-bakeryBerry/70"></div>
      </div>

      {/* Reveal scene for the final pinned state */}
      <div
        ref={revealSceneRef}
        className="absolute inset-0 z-20 flex items-end justify-center px-4 pb-8 pt-28 text-center pointer-events-none md:items-end md:px-5 md:pb-14"
      >
        <div className="w-full max-w-[22rem] rounded-[1.6rem] border-2 border-bakeryBerry/20 bg-bakeryBg/90 px-4 py-4 shadow-[8px_8px_0px_0px_rgba(166,28,60,0.14)] backdrop-blur-md md:max-w-5xl md:rounded-[2.5rem] md:px-8 md:py-7 md:shadow-[12px_12px_0px_0px_rgba(166,28,60,0.16)]">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:mb-4 md:gap-3">
            <span className="rounded-full border-2 border-bakeryBerry bg-white px-3 py-1.5 font-body text-[9px] font-black uppercase tracking-[0.22em] text-bakeryBerry shadow-[4px_4px_0px_0px_rgba(166,28,60,0.18)] md:px-4 md:py-2 md:text-[11px] md:tracking-[0.28em]">
              Fresh Bento Daily
            </span>
            <span className="rounded-full bg-bakeryBerry px-3 py-1.5 font-body text-[9px] font-black uppercase tracking-[0.22em] text-white md:px-4 md:py-2 md:text-[11px] md:tracking-[0.28em]">
              Custom Mood Cake
            </span>
          </div>

          <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.15rem,13vw,4rem)] font-black uppercase leading-[0.88] tracking-tight text-bakeryBerry md:text-[clamp(2.3rem,6vw,5.8rem)]">
            Kue kecil,
            <span className="block text-bakeryText">momen besar.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl font-body text-[13px] font-semibold leading-relaxed text-bakeryText/80 md:mt-4 md:text-base">
            Pilih rasa, warna, dan tulisan yang paling cocok buat mood kamu —
            dari kejutan manis sampai hadiah personal yang terasa niat.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pointer-events-auto md:mt-6 md:gap-3">
            <a
              href="#catalog"
              data-cursor-hover
              className="rounded-full border-2 border-bakeryText bg-bakeryBerry px-4 py-2.5 font-display text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1 md:px-8 md:py-4 md:text-sm md:tracking-[0.18em] md:shadow-[6px_6px_0px_0px_rgba(74,62,61,1)]"
            >
              Lihat Catalog
            </a>
            <Link
              to="/contact"
              data-cursor-hover
              className="rounded-full border-2 border-bakeryText bg-white px-4 py-2.5 font-display text-[11px] font-black uppercase tracking-[0.14em] text-bakeryBerry shadow-[4px_4px_0px_0px_rgba(74,62,61,1)] transition-transform hover:-translate-y-1 md:px-8 md:py-4 md:text-sm md:tracking-[0.18em] md:shadow-[6px_6px_0px_0px_rgba(74,62,61,1)]"
            >
              Order Custom
            </Link>
          </div>
        </div>
      </div>

      {/* Content wrapper for things that disappear (Text and Button) */}
      <div
        ref={heroContentRef}
        className="relative z-20 w-full max-w-[1600px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-center md:justify-between min-h-[100svh] py-32 md:py-0 pointer-events-none gap-12 md:gap-0 transform-gpu will-change-transform"
      >
        {/* LEFT: Giant Typography */}
        <div
          ref={titleLeftRef}
          className="w-full md:w-6/12 flex flex-col justify-center leading-[0.85] md:leading-[0.8] z-30 mb-8 md:mb-0 mt-20 md:mt-0"
        >
          <div className="w-full flex justify-center md:justify-start">
            <h1 className="font-groovy text-[clamp(4rem,15vw,16rem)] text-white tracking-normal uppercase whitespace-nowrap drop-shadow-md">
              YUMMY
            </h1>
          </div>
          <div className="w-full flex justify-center md:justify-end md:-mr-8">
            <h1 className="font-groovy text-[clamp(4rem,15vw,16rem)] text-white tracking-normal uppercase whitespace-nowrap drop-shadow-md">
              YUMZ
            </h1>
          </div>
          <div className="w-full flex justify-center md:justify-start">
            <h1 className="font-groovy text-[clamp(4rem,15vw,16rem)] text-white tracking-normal uppercase whitespace-nowrap drop-shadow-md">
              CAKE
            </h1>
          </div>
        </div>

        {/* RIGHT: Description & Button */}
        <div className="w-full md:w-4/12 flex flex-col justify-center items-center md:items-start md:pl-20 z-30 pointer-events-auto text-center md:text-left">
          <p
            ref={textRightRef}
            className="font-body text-white text-sm md:text-base leading-relaxed mb-8 max-w-sm drop-shadow-md font-medium"
          >
            Menghadirkan seni dekorasi bento cake premium yang memadukan
            keindahan visual dan kelezatan rasa. Setiap kreasi dibuat secara
            detail dengan bahan berkualitas tinggi, menghasilkan cita rasa yang
            seimbang dan tidak terlalu manis. Temukan katalog desain eksklusif
            kami dan pesan bento cake Anda sekarang.
          </p>
        </div>
      </div>
    </section>
  );
}
