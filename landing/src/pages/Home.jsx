import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import MarqueeSeparator from '../components/sections/MarqueeSeparator';
import Catalog from '../components/sections/Catalog';
import DeliveryBox from '../components/sections/DeliveryBox';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <MarqueeSeparator />
        <Catalog />
        <DeliveryBox />
      </main>
      <Footer />
    </>
  );
}
