import React, { useState } from "react";
import { motion } from "framer-motion";
import smartCar from "../../assets/smart-car.png";
import scooter from "../../assets/scooter.png";
import moped from "../../assets/moped.png";
import shape1 from "../../assets/shape1.svg";
import shape2 from "../../assets/shape2.svg";
import vector from "../../assets/Vector 3.svg";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  imageWidth: string;
  imageHeight: string;
  index: number;
  gap?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  imageWidth,
  imageHeight,
  index,
  gap = "gap-8",
  onFocus,
  onBlur,
}) => {
  return (
    <motion.div
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      className="bg-transparent rounded-[20px] border-2 border-gray-300 w-[420px] h-[420px] flex-shrink-0 flex flex-col p-20 outline-none"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.03,
        y: -5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={`flex flex-col ${gap} justify-between flex-1`}>
        {/* Title + Description */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-[24px] text-black">{title}</h3>
          <p className="font-medium text-[#858898] text-[17px]">{description}</p>
        </div>

        {/* Image */}
        <div
          className="bg-center bg-contain bg-no-repeat self-center"
          style={{
            backgroundImage: `url('${image}')`,
            height: imageHeight,
            width: imageWidth,
          }}
        />
      </div>
    </motion.div>
  );
};

const TravelServicesNew: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <div className="relative bg-[#fffee9] w-full h-full overflow-hidden flex items-center justify-center">
      <style>{`
        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          align-items: center;
          will-change: transform;
          animation: marquee 15s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>

      {/* Background Shapes */}
      <motion.img
        src={shape1}
        alt=""
        className="absolute left-[-160px] top-[-3px] rotate-[18.06deg] w-[300px] h-[380px]"
        initial={{ opacity: 0, x: -100, rotate: 0 }}
        animate={{ opacity: 0.8, x: 0, rotate: 38.06 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />

      <motion.img
        src={vector}
        alt=""
        className="absolute w-[800px] h-[680px]"
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />

      <motion.img
        src={shape2}
        alt=""
        className="absolute right-[-100px] bottom-[-100px] w-[250px] h-[420px]"
        initial={{ opacity: 0, x: 100, rotate: 0 }}
        animate={{ opacity: 0.6, x: 0, rotate: -15 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="flex flex-col items-center gap-30 w-full h-full">
        <motion.h2
          className="font-['Press_Start_2P',_monospace] text-[46px] text-black text-center max-w-[660px]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Main Functions
        </motion.h2>

        {/* Marquee */}
        <div className="w-full relative">
          <div
            className={`marquee-track ${isPaused ? "paused" : ""}`}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            {/* First set */}
            <ServiceCard
              title="Heat Map"
              description="Visualize real-time demand patterns and hotspots across the city. Our intelligent heat mapping technology helps optimize route planning and identifies high-traffic areas for better service efficiency."
              image={smartCar}
              gap="gap-[98px]"
              imageWidth="214px"
              imageHeight="121px"
              index={0}
              onFocus={pause}
              onBlur={resume}
            />
            <ServiceCard
              title="Hint Map"
              description="Get intelligent route suggestions and traffic insights powered by machine learning. Our hint system provides real-time recommendations to help you navigate efficiently and avoid congested areas."
              image={scooter}
              gap="gap-10"
              imageWidth="157px"
              imageHeight="150px"
              index={1}
              onFocus={pause}
              onBlur={resume}
            />
            <ServiceCard
              title="Destination Prediction"
              description="Advanced AI algorithms predict your likely destinations based on travel patterns and preferences. Experience seamless journey planning with intelligent forecasting that saves time and optimizes your routes."
              image={moped}
              gap="gap-[70px]"
              imageWidth="185px"
              imageHeight="156px"
              index={2}
              onFocus={pause}
              onBlur={resume}
            />

            {/* Second set */}
            <ServiceCard
              title="Heat Map"
              description="Visualize real-time demand patterns and hotspots across the city. Our intelligent heat mapping technology helps optimize route planning and identifies high-traffic areas for better service efficiency."
              image={smartCar}
              gap="gap-[98px]"
              imageWidth="214px"
              imageHeight="121px"
              index={0}
              onFocus={pause}
              onBlur={resume}
            />
            <ServiceCard
              title="Hint Map"
              description="Get intelligent route suggestions and traffic insights powered by machine learning. Our hint system provides real-time recommendations to help you navigate efficiently and avoid congested areas."
              image={scooter}
              gap="gap-10"
              imageWidth="157px"
              imageHeight="150px"
              index={1}
              onFocus={pause}
              onBlur={resume}
            />
            <ServiceCard
              title="Destination Prediction"
              description="Advanced AI algorithms predict your likely destinations based on travel patterns and preferences. Experience seamless journey planning with intelligent forecasting that saves time and optimizes your routes."
              image={moped}
              gap="gap-[70px]"
              imageWidth="185px"
              imageHeight="156px"
              index={2}
              onFocus={pause}
              onBlur={resume}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelServicesNew;
