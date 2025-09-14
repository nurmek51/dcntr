import HeaderNew from './components/sections/header-new';
import HeroNew from './components/sections/hero-new';
import TravelServicesNew from './components/sections/travel-services-new';
import ChooseSection from './components/sections/cta-new';

function App() {
  return (
    <>
      <HeaderNew />
      <div className="flex flex-col items-center justify-center gap-[100px]">
        
        <HeroNew />
        <TravelServicesNew />
        <ChooseSection />
      </div>
    </>
  );
}

export default App;
