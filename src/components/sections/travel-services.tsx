import smartCar from '../../assets/smart-car.png';
import scooter from '../../assets/scooter.png';
import moped from '../../assets/moped.png';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
}

function ServiceCard({ title, description, image, imageAlt, imageWidth, imageHeight, className = "" }: ServiceCardProps) {
  return (
    <div className={`bg-white rounded-[20px] shadow-[3px_4px_4px_0px_rgba(0,0,0,0.4)] flex items-center gap-[10px] ${className}`}>
      <div className="flex flex-col items-center gap-[98px] w-[279px]">
        <div className="flex flex-col gap-[10px] w-full">
          <h3 className="font-inter font-bold text-[24px] leading-[1.21] text-black">
            {title}
          </h3>
          <p className="font-inter font-medium text-[14px] leading-[1.21] text-[#858898] w-[279px]">
            {description}
          </p>
        </div>
        <img 
          src={image} 
          alt={imageAlt}
          className="object-contain"
          style={{ width: imageWidth, height: imageHeight }}
        />
      </div>
    </div>
  );
}

export function TravelServices() {
  return (
    <section className="relative w-full h-[810px] mt-[200px] md:mt-[150px] sm:mt-[100px] md:h-[700px] sm:h-[600px]">
      {/* Background Shapes */}
      <div className="absolute left-[-150px] top-[-3px] w-[300.8px] h-[297.73px] bg-[#94EA0D] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px]"></div>
      <div className="absolute right-[-150px] bottom-[531px] w-[300.8px] h-[297.73px] bg-[#94EA0D] md:w-[200px] md:h-[200px] md:bottom-[400px] sm:w-[150px] sm:h-[150px] sm:bottom-[300px]"></div>
      
      {/* Title Section */}
      <div className="flex flex-col items-center gap-[16px] w-full max-w-[803px] mx-auto pt-[45px] px-4">
        <h2 className="font-inter font-bold text-[46px] leading-[1.21] uppercase text-center text-black max-w-[660px] md:text-[36px] sm:text-[28px]">
          Travel Around The City
        </h2>
      </div>

      {/* Service Cards */}
      <div className="flex items-center justify-center gap-[47px] mt-[174px] px-[51px] md:gap-[30px] md:mt-[120px] md:px-[30px] sm:flex-col sm:gap-[20px] sm:mt-[80px] sm:px-[20px]">
        {/* TAG Card */}
        <ServiceCard
          title="TAG"
          description="Our service ensures a comfortable ride with modern vehicles, climate control, spacious seating, and professional drivers, making your journey pleasant and stress-free."
          image={smartCar}
          imageAlt="Smart Car"
          imageWidth={214}
          imageHeight={121}
          className="w-[353px] h-[436px] px-[37px] py-0 md:w-[280px] md:h-[350px] md:px-[20px] sm:w-[300px] sm:h-[320px]"
        />

        {/* Scooter Card */}
        <ServiceCard
          title="Scooter"
          description="Our scooter rental service provides top-quality, well-maintained scooters with ergonomic designs, ensuring a smooth, comfortable, and hassle-free riding experience at affordable rates."
          image={scooter}
          imageAlt="Scooter"
          imageWidth={157}
          imageHeight={150}
          className="w-[353px] h-[436px] px-[33px] py-[20px] md:w-[280px] md:h-[350px] md:px-[20px] sm:w-[300px] sm:h-[320px]"
        />

        {/* Motorbike Card */}
        <ServiceCard
          title="Motorbike"
          description="Our motorbike rental service offers high-quality, well-maintained bikes with powerful engines, ensuring a thrilling, comfortable, and reliable riding experience at competitive rates."
          image={moped}
          imageAlt="Motorbike"
          imageWidth={185}
          imageHeight={156}
          className="w-[353px] h-[436px] px-[33px] py-[20px] md:w-[280px] md:h-[350px] md:px-[20px] sm:w-[300px] sm:h-[320px]"
        />
      </div>
    </section>
  );
}
