import React from 'react';
import smartCar from '../../assets/smart-car.png';
import scooter from '../../assets/scooter.png';
import moped from '../../assets/moped.png';
import shape1 from '../../assets/shape1.svg';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  gap: string;
  imageWidth: string;
  imageHeight: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, image, imageAlt, gap, imageWidth, imageHeight }) => {
  return (
    <div className="bg-white flex flex-col items-center justify-between px-[37px] py-6 rounded-[20px] shadow-[3px_4px_4px_0px_rgba(0,0,0,0.4)] w-[353px] h-[436px]">
      <div className={`flex flex-col ${gap} items-center w-full`}>
        {/* Title + Description */}
        <div className="flex flex-col gap-2.5 items-start w-full">
          <h3 className="font-['Inter:Bold',_sans-serif] font-bold text-[24px] text-black">
            {title}
          </h3>
          <p className="font-['Inter:Medium',_sans-serif] font-medium text-[#858898] text-[17px]">
            {description}
          </p>
        </div>
        {/* Image */}
        <div
          className="bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url('${image}')`,
            height: imageHeight,
            width: imageWidth,
          }}
        />
      </div>
    </div>
  );
};

const TravelServicesNew: React.FC = () => {
  return (
    <div className="relative bg-[#fffee9] w-full py-24 overflow-hidden">
      {/* Background Shapes */}
      <img
        src={shape1}
        alt=""
        className="absolute left-[-150px] top-[-3px] rotate-[38.06deg] w-[222px] h-[204px]"
      />
      <img
        src={shape1}
        alt=""
        className="absolute right-[-50px] bottom-[50px] rotate-[38.06deg] w-[222px] h-[204px]"
      />

      {/* Section Content */}
      <div className="flex flex-col items-center gap-20">
        {/* Title */}
        <h2 className="font-['Inter:Bold',_sans-serif] font-bold text-[46px] text-black text-center uppercase max-w-[660px]">
          Travel Around The City
        </h2>

        {/* Service Cards */}
        <div className="flex justify-center gap-[20px] flex-wrap">
          <ServiceCard
            title="TAG"
            description="Our service ensures a comfortable ride with modern vehicles, climate control, spacious seating, and professional drivers, making your journey pleasant and stress-free."
            image={smartCar}
            imageAlt="smart car"
            gap="gap-[98px]"
            imageWidth="214px"
            imageHeight="121px"
          />
          <ServiceCard
            title="Scooter"
            description="Our scooter rental service provides top-quality, well-maintained scooters with ergonomic designs, ensuring a smooth, comfortable, and hassle-free riding experience at affordable rates."
            image={scooter}
            imageAlt="scooter turned right"
            gap="gap-10"
            imageWidth="157px"
            imageHeight="150px"
          />
          <ServiceCard
            title="Motorbike"
            description="Our motorbike rental service offers high-quality, well-maintained bikes with powerful engines, ensuring a thrilling, comfortable, and reliable riding experience at competitive rates."
            image={moped}
            imageAlt="moped"
            gap="gap-[70px]"
            imageWidth="185px"
            imageHeight="156px"
          />
        </div>
      </div>
    </div>
  );
};

export default TravelServicesNew;
