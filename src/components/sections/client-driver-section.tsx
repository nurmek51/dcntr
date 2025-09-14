import { useNavigate } from 'react-router-dom';
import clientPerson from '../../assets/client-person.png';
import taxiCar from '../../assets/taxi-car-6da396.png';
import indriveLogo from '../../assets/indrive-logo-small.png';
import nomadiaIconSmall from '../../assets/nomadia-icon-small.png';
import bgVector from '../../assets/bg-vector.svg';
import clientBgVector from '../../assets/client-bg-vector.svg';
import taxiVgVector from '../../assets/taxi-vg-vector.svg';

export function ClientDriverSection() {
  const navigate = useNavigate();

  const handleTryItNow = () => {
    navigate('/destination-prediction');
  };

  return (
    <section className="relative w-full h-full bg-[#FFFEE9] pt-16">
      {/* Desktop Layout */}
      <div className="hidden md:flex relative w-full h-full">
        {/* Central Green Lightning/Zigzag Divider */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img src={bgVector} alt="divider" className="h-full object-cover" />
        </div>
        
        {/* Central Try It Now Button */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button
            onClick={handleTryItNow}
            className="bg-[#94EA0D] hover:bg-[#7BC108] transition-all duration-300 px-12 py-6 rounded-[20px] shadow-2xl border-4 border-white hover:border-[#94EA0D] transform hover:scale-105 active:scale-95"
          >
            <span className="font-poppins font-bold text-[28px] text-black tracking-wide">TRY IT NOW</span>
          </button>
        </div>
        
        {/* Left Side - Client */}
        <div className="flex-1 relative h-full flex flex-col items-center justify-center">
          {/* Client Background Vector */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <img 
              src={clientBgVector} 
              alt="Client Background" 
              className="w-[300px] h-[300px] object-contain opacity-60"
            />
          </div>
          
          {/* Floating InDrive Logo Circles */}
          <div className="absolute top-24 left-20 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute top-48 right-24 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute bottom-48 left-28 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute bottom-24 right-20 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          
          {/* Floating Nomadia Icons */}
          <div className="absolute top-40 left-48 animate-bounce">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-64 right-40 animate-bounce delay-150">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute top-64 right-32 animate-bounce delay-300">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-36 left-40 animate-bounce delay-500">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          
          {/* Client Person */}
          <div className="relative z-20 flex flex-col items-center">
            <img 
              src={clientPerson} 
              alt="Client" 
              className="w-[280px] h-[380px] object-contain mb-8 drop-shadow-xl"
            />
            {/* Client Label */}
            <div className="bg-[#94EA0D] px-10 py-4 rounded-[12px] shadow-xl border-2 border-white">
              <span className="font-poppins font-bold text-[26px] text-black tracking-wide">CLIENT</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Taxi Driver */}
        <div className="flex-1 relative h-full flex flex-col items-center justify-center">
          {/* Taxi Driver Background Vector */}
          <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 z-0">
            <img 
              src={taxiVgVector} 
              alt="Taxi Driver Background" 
              className="w-[300px] h-[300px] object-contain opacity-60"
            />
          </div>
          
          {/* Floating InDrive Logo Circles */}
          <div className="absolute top-24 right-20 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute top-48 left-24 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute bottom-48 right-28 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          <div className="absolute bottom-24 left-20 w-[70px] h-[70px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg">
            <img src={indriveLogo} alt="InDrive" className="w-[35px] h-[35px]" />
          </div>
          
          {/* Floating Nomadia Icons */}
          <div className="absolute top-40 right-48 animate-bounce delay-200">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-64 left-40 animate-bounce delay-400">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute top-64 left-32 animate-bounce delay-100">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-36 right-40 animate-bounce delay-600">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[40px] h-[40px] drop-shadow-md" />
          </div>
          
          {/* Taxi Driver */}
          <div className="relative z-20 flex flex-col items-center">
            <img 
              src={taxiCar} 
              alt="Taxi Driver" 
              className="w-[350px] h-[200px] object-contain mb-8 drop-shadow-xl"
            />
            {/* Taxi Driver Label */}
            <div className="bg-[#94EA0D] px-10 py-4 rounded-[12px] shadow-xl border-2 border-white">
              <span className="font-poppins font-bold text-[26px] text-black tracking-wide">TAXI DRIVER</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout - Stacked Vertically with Smooth Scrolling */}
      <div className="md:hidden">
        
        {/* Mobile Try It Now Button - Fixed Position */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            onClick={handleTryItNow}
            className="bg-[#94EA0D] hover:bg-[#7BC108] transition-all duration-300 px-8 py-4 rounded-[16px] shadow-2xl border-3 border-white hover:border-[#94EA0D] transform hover:scale-105 active:scale-95"
          >
            <span className="font-poppins font-bold text-[20px] text-black tracking-wide">TRY IT NOW</span>
          </button>
        </div>
        
        {/* Client Section */}
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Client Background Vector */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <img 
              src={clientBgVector} 
              alt="Client Background" 
              className="w-[200px] h-[200px] object-contain opacity-50"
            />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-28 left-6 w-[50px] h-[50px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg animate-bounce">
            <img src={indriveLogo} alt="InDrive" className="w-[25px] h-[25px]" />
          </div>
          <div className="absolute top-36 right-8 animate-bounce delay-200">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[30px] h-[30px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-52 left-10 w-[50px] h-[50px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg animate-bounce delay-400">
            <img src={indriveLogo} alt="InDrive" className="w-[25px] h-[25px]" />
          </div>
          <div className="absolute bottom-68 right-6 animate-bounce delay-600">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[30px] h-[30px] drop-shadow-md" />
          </div>
          
          {/* Client Content */}
          <div className="relative z-20 flex flex-col items-center">
            <img 
              src={clientPerson} 
              alt="Client" 
              className="w-[200px] h-[280px] object-contain mb-6 drop-shadow-xl"
            />
            <div className="bg-[#94EA0D] px-8 py-3 rounded-[10px] shadow-xl border-2 border-white">
              <span className="font-poppins font-bold text-[20px] text-black tracking-wide">CLIENT</span>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-[30px] h-[50px] border-2 border-[#94EA0D] rounded-full flex justify-center">
              <div className="w-[6px] h-[10px] bg-[#94EA0D] rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Taxi Driver Section */}
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8F8F8] to-[#FFFEE9]">
          {/* Taxi Driver Background Vector */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <img 
              src={taxiVgVector} 
              alt="Taxi Driver Background" 
              className="w-[200px] h-[200px] object-contain opacity-50"
            />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-28 right-6 w-[50px] h-[50px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg animate-bounce delay-300">
            <img src={indriveLogo} alt="InDrive" className="w-[25px] h-[25px]" />
          </div>
          <div className="absolute top-36 left-8 animate-bounce delay-500">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[30px] h-[30px] drop-shadow-md" />
          </div>
          <div className="absolute bottom-52 right-10 w-[50px] h-[50px] rounded-full bg-[#94EA0D] flex items-center justify-center shadow-lg animate-bounce delay-700">
            <img src={indriveLogo} alt="InDrive" className="w-[25px] h-[25px]" />
          </div>
          <div className="absolute bottom-68 left-6 animate-bounce delay-100">
            <img src={nomadiaIconSmall} alt="Nomadia" className="w-[30px] h-[30px] drop-shadow-md" />
          </div>
          
          {/* Taxi Driver Content */}
          <div className="relative z-20 flex flex-col items-center">
            <img 
              src={taxiCar} 
              alt="Taxi Driver" 
              className="w-[240px] h-[135px] object-contain mb-6 drop-shadow-xl"
            />
            <div className="bg-[#94EA0D] px-8 py-3 rounded-[10px] shadow-xl border-2 border-white">
              <span className="font-poppins font-bold text-[20px] text-black tracking-wide">TAXI DRIVER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
