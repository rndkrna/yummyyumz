import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData";

gsap.registerPlugin(ScrollTrigger);

export default function Catalog() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Title reveal with split animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        },
      );

      // Staggered cards reveal with rotation
      gsap.fromTo(
        cardsRef.current,
        { y: 100, opacity: 0, scale: 0.8, rotationY: -30 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          },
        },
      );

      // Add parallax to each card
      cardsRef.current.forEach((card, index) => {
        const direction = index % 2 === 0 ? 20 : -20;
        gsap.to(card, {
          y: direction,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section
      id="catalog"
      className="bg-white py-20 md:py-32 px-4 md:px-16 border-t-2 border-bakeryText rounded-t-[2rem] md:rounded-t-[3rem] -mt-10 relative z-20"
      ref={containerRef}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-16 md:mb-24 overflow-hidden">
          <h2
            ref={titleRef}
            className="font-display font-extrabold text-[clamp(2.5rem,8vw,10rem)] text-bakeryBerry leading-none uppercase tracking-tighter text-center px-2"
            style={{
              WebkitTextStroke: "1px #4A3E3D",
              textShadow: "4px 4px 0 #4A3E3D",
            }}
          >
            RASA FAVORIT
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 mt-12 md:mt-16">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              ref={addToRefs}
              data-cursor-hover
              data-cursor-text="LIHAT"
              data-magnetic
              className="group cursor-pointer flex flex-col transform-gpu perspective-1000"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector(".product-card"), {
                  rotationY: 5,
                  rotationX: -5,
                  z: 50,
                  duration: 0.6,
                  ease: "expo.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector(".product-card"), {
                  rotationY: 0,
                  rotationX: 0,
                  z: 0,
                  duration: 0.6,
                  ease: "expo.out",
                });
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget.querySelector(".product-card");
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                  rotationX: rotateX,
                  rotationY: rotateY,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
            >
              {/* Product Info Bar */}
              <div className="flex justify-between items-start mb-4 px-2 relative z-10">
                <div className="font-display overflow-hidden">
                  <h3 className="font-extrabold text-xl text-bakeryBerry uppercase leading-tight tracking-tight transform group-hover:translate-x-2 transition-transform duration-500">
                    {prod.title}
                  </h3>
                  <p className="font-body text-bakeryText text-xs mt-1 uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                    {prod.desc}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-bakeryText shadow-[2px_2px_0_rgba(74,62,61,1)] group-hover:scale-125 group-hover:rotate-90 transition-all duration-500 ${prod.accent} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 shimmer"></div>
                  <svg
                    className="w-4 h-4 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div className="px-2 mb-4">
                <p className="font-display font-extrabold text-xl group-hover:text-bakeryBerry transition-colors">
                  {prod.price}
                </p>
              </div>

              {/* Product Image Area */}
              <div className="product-card transform-style-3d">
                <div
                  className={`w-full aspect-[3/4] ${prod.color} border-2 border-bakeryText rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[12px_12px_0px_rgba(74,62,61,1)] transition-all duration-500 backface-hidden`}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Stick / Base placeholder */}
                  <div className="absolute bottom-[-10%] w-6 h-32 bg-[#e0b484] rounded-full border-2 border-bakeryText z-0 transform group-hover:scale-110 transition-transform duration-700"></div>

                  {/* Cake body placeholder */}
                  <div className="w-3/5 h-3/5 bg-bakeryBerry rounded-t-full rounded-b-md border-2 border-bakeryText z-10 flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-out relative overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-white/20 rounded-t-full rounded-b-md animate-glow"></div>
                    <span className="text-4xl group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 relative z-10">
                      🎂
                    </span>
                  </div>

                  {/* Subtle shadow */}
                  <div className="absolute bottom-4 w-1/2 h-4 bg-black/20 rounded-[100%] blur-md group-hover:w-3/5 transition-all duration-500"></div>

                  {/* Sparkle effects */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  <div
                    className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Catalog Button */}
        <div className="flex justify-center mt-16 md:mt-24 px-4">
          <Link
            to="/catalog"
            data-cursor-hover
            data-cursor-text="KLIK"
            data-magnetic
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 bg-bakeryBerry text-white font-display font-bold text-lg md:text-2xl uppercase tracking-widest rounded-full border-3 border-bakeryText shadow-[6px_6px_0px_rgba(74,62,61,1)] md:shadow-[8px_8px_0px_rgba(74,62,61,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(74,62,61,1)] md:hover:shadow-[12px_12px_0px_rgba(74,62,61,1)] transition-all duration-500 overflow-hidden z-10"
          >
            <span className="relative z-10 group-hover:text-bakeryText transition-colors duration-500 flex items-center gap-3">
              ALL CATALOG
              <svg
                className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-3 group-hover:rotate-45 transition-all duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-bakeryPeach transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            <div className="absolute inset-0 shimmer"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
