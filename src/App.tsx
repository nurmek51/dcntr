import { Header } from './components/layout/header';
import { HeroSection } from './components/sections/hero-section';
import { TravelServices } from './components/sections/travel-services';
import { CTASection } from './components/sections/cta-section';

function App() {
  return (
    <div className="min-h-screen bg-[#FFFEE9] w-full max-w-[1280px] mx-auto relative overflow-x-hidden">
      <Header />
      <HeroSection />
      <TravelServices />
      <CTASection />
    </div>
  );
}

export default App;
