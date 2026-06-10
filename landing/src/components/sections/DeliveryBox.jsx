import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { momentSlides } from "../../data/siteData";

gsap.registerPlugin(ScrollTrigger);

const momentHighlights = [
  {
    title: "Personal",
    description:
      "Bisa jadi kejutan kecil, hadiah manis, atau ucapan yang terasa dekat.",
  },
  {
    title: "Custom",
    description:
      "Tulisan, warna, dan nuansa desain bisa disesuaikan dengan momen Anda.",
  },
];

export default function DeliveryBox() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!momentSlides.length) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex(
        (currentIndex) => (currentIndex + 1) % momentSlides.length,
      );
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal Text
      gsap.from(textRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // Reveal Image
      gsap.from(imageRef.current, {
        x: 60,
        opacity: 0,
        rotation: 3,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeSlide = momentSlides[activeIndex] ?? null;

  const handlePrev = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? momentSlides.length - 1 : currentIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % momentSlides.length);
  };

  return (
    <section
      id="moment"
      ref={containerRef}
      className="relative w-full bg-gradient-to-br from-bakeryPeach via-white/50 to-bakeryPeach py-24 md:py-40 px-4 md:px-16 overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-bakeryBerry/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-bakeryBerry/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center relative z-10">
        {/* Text Content */}
        <div
          ref={textRef}
          className="z-10 pr-0 md:pr-12 text-center md:text-left"
        >
          <span
            className="font-body text-bakeryBerry uppercase tracking-widest text-sm font-bold mb-6 md:mb-8 block animate-bounce"
            style={{ animationDelay: "0s" }}
          >
            ✨ Moment ✨
          </span>
          <h2 className="font-display font-extrabold text-bakeryBerry text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] md:leading-[0.85] mb-8 md:mb-10 uppercase tracking-tighter drop-shadow-md">
            Bukan Cuma
            <br />
            Kue Biasa.
          </h2>
          <p className="font-body text-lg md:text-2xl leading-relaxed mb-12 md:mb-16 max-w-lg mx-auto md:mx-0 font-medium text-bakeryBerry">
            Setiap bento cake hadir untuk ikut masuk ke momen yang ingin Anda
            rayakan
          </p>

          <div className="grid grid-cols-2 gap-6 md:gap-10">
            {momentHighlights.map((item) => (
              <div
                key={item.title}
                className="border-l-4 border-bakeryBerry pl-4"
              >
                <h4 className="font-display font-bold text-bakeryBerry text-2xl md:text-3xl mb-2 tracking-tight">
                  {item.title}
                </h4>
                <p className="font-body text-sm md:text-base text-bakeryText font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Visual - ENLARGED & BOLD */}
        <div
          ref={imageRef}
          className="relative h-[70vh] md:h-[90vh] rounded-[50px] overflow-hidden border-6 border-bakeryBerry shadow-[20px_20px_0px_0px_rgba(74,62,61,1)] transform -rotate-3 group mt-12 md:mt-0"
        >
          {activeSlide ? (
            <>
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="w-full h-full object-cover transition-all duration-[2000ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bakeryBerry via-bakeryBerry/60 to-transparent px-8 pb-10 pt-24 text-white md:px-10">
                <div className="flex items-center gap-4 mb-4">
                  {activeSlide.tag ? (
                    <span className="rounded-full border-2 border-white/80 bg-white/20 px-5 py-3 font-body text-[12px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                      🎉 {activeSlide.tag}
                    </span>
                  ) : null}
                  <span className="font-body text-xs font-bold uppercase tracking-[0.3em] text-white/90 bg-white/10 px-4 py-2 rounded-full">
                    {activeIndex + 1} / {momentSlides.length}
                  </span>
                </div>
                <h3 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
                  {activeSlide.title}
                </h3>
                <p className="font-body text-base md:text-lg font-semibold leading-relaxed text-white/95">
                  {activeSlide.caption}
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-bakeryBg px-8 text-center text-bakeryBerry">
              <p className="font-display text-3xl font-bold uppercase tracking-tight">
                Moment akan segera hadir.
              </p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-3">
              {momentSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Pilih slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full border-2 border-white/70 transition-all duration-500 ease-out transform hover:scale-125 ${
                    index === activeIndex
                      ? "w-12 h-5 bg-white shadow-lg"
                      : "w-4 h-4 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Slide sebelumnya"
                onClick={handlePrev}
                className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-bakeryBerry bg-white font-display text-3xl font-bold text-bakeryBerry shadow-[6px_6px_0px_0px_rgba(74,62,61,1)] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,62,61,1)]"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Slide berikutnya"
                onClick={handleNext}
                className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-bakeryBerry bg-bakeryBerry font-display text-3xl font-bold text-white shadow-[6px_6px_0px_0px_rgba(74,62,61,1)] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(74,62,61,1)]"
              >
                →
              </button>
            </div>
          </div>

          {/* Spinning Badge - BIGGER */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 w-40 h-40 md:w-48 md:h-48 bg-bakeryBg rounded-full flex items-center justify-center border-5 border-bakeryBerry shadow-xl animate-[spin_12s_linear_infinite] z-20 hover:animate-[spin_8s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="absolute w-full h-full p-3">
              <path
                id="curve"
                fill="transparent"
                d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              />
              <text className="font-display font-bold text-[14px] uppercase tracking-[0.25em] fill-bakeryBerry">
                <textPath href="#curve" startOffset="0%">
                  SWEET LITTLE MOMENTS • CUSTOM FOR YOU •
                </textPath>
              </text>
            </svg>
            <span className="font-display font-extrabold text-bakeryBerry text-4xl">
              ♥
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-bakeryPeach/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-bakeryBerry/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </section>
  );
}
