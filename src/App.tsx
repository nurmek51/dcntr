import HeaderNew from './components/sections/header-new';
import HeroNew from './components/sections/hero-new';
import TravelServicesNew from './components/sections/travel-services-new';
import { ClientDriverSection } from './components/sections/client-driver-section';
import TeamSection from './components/sections/team-section';

function App() {
  return (
    <>
      {/* Scroll Snap Container */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory snap-container">
        {/* Hero Section - Full Screen */}
        <div className="h-screen w-full snap-start snap-always">
          <HeaderNew />
          <HeroNew />
        </div>
        
        {/* Travel Services Section - Full Screen */}
        <div className="h-screen w-full flex items-center justify-center snap-start snap-always">
          <TravelServicesNew />
        </div>
        
        {/* Client Driver Section - Full Screen */}
        <div className="h-screen w-full snap-start snap-always">
          <ClientDriverSection />
        </div>
        
        {/* Team Section - Full Screen */}
        <div className="h-screen w-full snap-start snap-always">
          <TeamSection />
        </div>
      </div>
    </>
  );
}

export default App;
