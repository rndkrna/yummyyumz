import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/sections/Footer";
import { catalogProducts } from "../data/siteData";
import { buildProductWhatsAppLink } from "../utils/contact";

gsap.registerPlugin(ScrollTrigger);

export default function FullCatalog() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // Grid Animation
      gsap.from(".product-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-bakeryBg min-h-screen pt-32">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 mb-20">
        <div
          ref={headerRef}
          className="flex justify-between items-end border-b-4 border-bakeryText pb-8 mb-12"
        >
          <div>
            <span className="font-body text-bakeryBerry uppercase tracking-widest text-sm font-bold block mb-4">
              Our Products
            </span>
            <h1 className="font-groovy text-[clamp(3rem,8vw,8rem)] text-bakeryBerry leading-[0.8] uppercase tracking-normal pr-4 pb-2">
              Full Catalog.
            </h1>
          </div>
          <span className="hidden md:inline-block border-2 border-bakeryText rounded-full px-6 py-2 font-display font-bold text-bakeryText uppercase tracking-widest text-sm mb-4">
            {catalogProducts.length} Products
          </span>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {catalogProducts.map((product) => (
            <div
              key={product.id}
              className="product-card group"
              data-cursor-hover
            >
              <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-bakeryText shadow-[10px_10px_0px_0px_rgba(74,62,61,1)] mb-6">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-display font-bold text-bakeryBerry text-3xl mb-2">
                    {product.name}
                  </h3>
                  <p className="font-body text-bakeryText font-medium text-sm leading-relaxed">
                    {product.desc}
                  </p>
                </div>
                <span className="font-display font-extrabold text-bakeryBerry text-xl bg-bakeryPeach px-4 py-2 rounded-xl border-2 border-bakeryText shadow-[4px_4px_0px_0px_rgba(74,62,61,1)] whitespace-nowrap">
                  {product.price}
                </span>
              </div>
              <a
                href={buildProductWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Order ${product.name} via WhatsApp`}
                className="mt-6 inline-flex items-center justify-center w-full bg-bakeryBerry text-white font-display font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-bakeryText transition-colors shadow-[4px_4px_0px_0px_rgba(74,62,61,1)]"
              >
                Order via WhatsApp →
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
