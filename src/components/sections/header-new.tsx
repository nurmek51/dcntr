import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/">
            <img src={inDriveLogo} alt="inDrive" className="h-[40px] w-auto object-contain hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-6">
          <Link 
            to="/map" 
            className="bg-black text-white px-6 py-2 rounded-[8px] font-semibold text-[14px] hover:bg-gray-800 transition-colors shadow-[2px_3px_3px_rgba(0,0,0,0.2)]"
          >
            Try Map Demo
          </Link>
          <Link 
            to="/destination-prediction" 
            className="bg-gray-200 text-black px-6 py-2 rounded-[8px] font-semibold text-[14px] hover:bg-gray-300 transition-colors"
          >
            Prediction Tool
          </Link>
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