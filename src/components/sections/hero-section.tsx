import landingHero from '../../assets/landing-hero.png';

export function HeroSection() {
  return (
    <section className="relative w-full h-[704px] mt-[48px] px-[18px] md:px-4 sm:px-2 md:h-[500px] sm:h-[400px]">
      {/* Hero Image Container */}
      <div className="relative w-full max-w-[1244px] h-[705px] md:h-[500px] sm:h-[400px]">
        <img 
          src={landingHero} 
          alt="Landing Hero" 
          className="w-full h-full object-cover rounded-[20px]"
        />
        
        {/* Text Overlay */}
        <div className="absolute left-[13px] top-[461px] w-[545px] h-[204px] md:left-[10px] md:top-[320px] md:w-[400px] sm:left-[8px] sm:top-[250px] sm:w-[300px] sm:h-[150px]">
          {/* Green Rectangle Background */}
          <div className="absolute left-0 top-[62px] w-[545px] h-[73px] bg-[#94EA0D] md:w-[400px] md:h-[60px] md:top-[50px] sm:w-[300px] sm:h-[45px] sm:top-[35px]"></div>
          
          {/* Text Content */}
          <div className="absolute left-[11px] top-[-9px] w-[524px] h-[216px] md:w-[390px] md:h-[180px] sm:w-[290px] sm:h-[140px]">
            <h2 className="font-inter font-semibold text-[60px] leading-[1.2] tracking-[-0.01em] text-white md:text-[45px] sm:text-[32px]">
              Save time<br />
              <span className="text-black">Save your money</span><br />
              Love you car.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
