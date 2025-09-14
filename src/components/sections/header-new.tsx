import React from 'react';
import inDriveLogo from '../../assets/indrive-logo-65b35d.png';
import nomadiaIcon from '../../assets/nomadia-icon.png';
import decentrathonLogo from '../../assets/decentrathon-logo-63c751.png';

const HeaderNew: React.FC = () => {
  return (
    <div className="relative bg-[#fffee9] h-[80px] w-full overflow-hidden">
      {/* Header Container */}
      <div className="absolute inset-0 flex h-[80px] items-center justify-between px-[51px]">
        {/* Left: inDrive logo */}
        <div className="flex items-center">
          <img src={inDriveLogo} alt="inDrive" className="h-[40px] w-auto object-contain" />
        </div>

        {/* Right: Nomadia + Decentrathon logos */}
        <div className="flex items-center gap-4">
          <img src={nomadiaIcon} alt="Nomadia" className="h-[40px] w-[40px] object-contain rounded-[8px]" />
          <img src={decentrathonLogo} alt="Decentrathon" className="h-[24px] w-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default HeaderNew;