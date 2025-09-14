import indriveLogo from '../../assets/indrive-logo-65b35d.png';
import nomadiaIcon from '../../assets/nomadia-icon.png';
import decentrathonLogo from '../../assets/decentrathon-logo-63c751.png';

export function Header() {
  return (
    <header className="w-full h-[47px] ">
      <div className="mx-auto flex items-center justify-between w-full px-auto md:px-4 sm:px-10 h-[47px]">
        {/* Left - InDrive Logo */}
        <div className="flex flex-col gap-[10px] w-[146px] md:w-[120px] sm:w-[100px]">
          <img 
            src={indriveLogo} 
            alt="InDrive" 
            className="w-full h-[47px] object-contain md:h-[40px] sm:h-[35px]"
          />
        </div>


        {/* Center - Nomadia */}
        <div className="flex items-center justify-center flex-1">
          <h1 className="font-poppins font-semibold text-[30px] leading-[1.2] tracking-[-0.01em] text-black text-center md:text-[26px] sm:text-[22px]">
            Sulpak Team
          </h1>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-[6px] h-[47px] md:gap-[4px] sm:gap-[2px]">
          <img 
            src={nomadiaIcon} 
            alt="Nomadia Icon" 
            className="w-[49.29px] h-[47.15px] object-cover md:w-[40px] md:h-[38px] sm:w-[35px] sm:h-[33px]"
          />
          <img 
            src={decentrathonLogo} 
            alt="Decentrathon" 
            className="w-[164.24px] h-[19.83px] object-contain md:w-[140px] md:h-[17px] sm:w-[120px] sm:h-[15px]"
          />
        </div>
      </div>
    </header>
  );
}
