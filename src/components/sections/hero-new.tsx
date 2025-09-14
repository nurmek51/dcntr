import React from 'react';
import landingHeroGif from '../../assets/landing-hero-gif.gif';
import rectangle from '../../assets/rectangle.png';

const HeroNew: React.FC = () => {
  return (
    <div className="relative h-[704px] w-full overflow-hidden flex items-center justify-center">
      {/* Hero Image Container */}
      <div className="relative flex items-center justify-center w-full max-w-[1244px] h-full">
        {/* Main Hero GIF */}
        <img
          src={landingHeroGif}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        />

        {/* Overlay for text (bottom-left corner) */}
        <div className="absolute bottom-8 left-8 z-10 flex flex-col">
          <div className="relative font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[1.2] text-[60px] tracking-[-0.6px] max-w-[524px] text-black">
            <p className="mb-0 text-white">Save time</p>

            {/* "Save your money" with rectangle background */}
            <div
              className="relative mb-0 w-fit px-2"
              style={{
                backgroundImage: `url('${rectangle}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <p className="font-['Poppins:SemiBold',_sans-serif] m-0">
                Save your money
              </p>
            </div>

            <p className="mb-0 text-white">Love your car.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroNew;
