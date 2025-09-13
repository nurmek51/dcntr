import analyticsIcon from '../../assets/analytics-icon.png';
import tryYourselfIcon from '../../assets/try-yourself-icon.png';

interface CTACardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  className?: string;
}

function CTACard({ title, description, image, imageAlt, className = "" }: CTACardProps) {
  return (
    <div className={`bg-gradient-to-b from-white to-white rounded-[21px] shadow-[3px_9px_4px_2px_rgba(0,0,0,0.75)] flex flex-col gap-[69px] ${className}`}>
      {/* Header with Green Background */}
      <div className="relative w-[247px] h-[36px]">
        <div className="absolute inset-0 bg-[#94EA0D]"></div>
        <h3 className="absolute left-[58px] top-0 font-poppins font-semibold text-[28px] leading-[1.2] tracking-[-0.01em] text-black w-[131px] h-[27px]">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[21px] w-full">
        <p className="font-inter font-medium text-[14px] leading-[1.21] text-black w-full">
          {description}
        </p>
        <img 
          src={image} 
          alt={imageAlt}
          className="w-[106px] h-[113px] object-cover"
        />
      </div>
    </div>
  );
}

function CTACardTryYourself({ title, description, image, imageAlt, className = "" }: CTACardProps) {
  return (
    <div className={`bg-gradient-to-b from-white to-white rounded-[21px] shadow-[3px_9px_4px_2px_rgba(0,0,0,0.75)] flex flex-col gap-[85px] ${className}`}>
      {/* Header with Green Background */}
      <div className="relative w-[247px] h-[36px]">
        <div className="absolute inset-0 bg-[#94EA0D]"></div>
        <h3 className="absolute left-[30px] top-0 font-poppins font-semibold text-[28px] leading-[1.2] tracking-[-0.01em] text-black w-[188px] h-[29px]">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[25px] w-full">
        <p className="font-inter font-medium text-[14px] leading-[1.21] text-black w-full">
          {description}
        </p>
        <img 
          src={image} 
          alt={imageAlt}
          className="w-[87px] h-[93px] object-cover"
        />
      </div>
    </div>
  );
}

export function CTASection() {
  return (
    <section className="w-full h-[844px] mt-[100px] relative md:h-[700px] sm:h-[600px] md:mt-[80px] sm:mt-[60px]">
      {/* Background Shape */}
      <div className="absolute left-[-113px] top-[57.47px] w-[1431px] h-[595.31px] border-[100px] border-[#94EA0D] shadow-[inset_0px_0px_19.46px_0px_rgba(255,255,255,0.25)] backdrop-blur-[177.49px] md:border-[60px] sm:border-[40px]"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Title and CTA Cards Container */}
        <div className="flex justify-center items-start gap-[218px] px-[242px] pt-[20px] w-full md:flex-col md:items-center md:gap-[40px] md:px-[40px] sm:px-[20px] sm:gap-[30px]">
          <h2 className="font-poppins font-semibold text-[48px] leading-[1.2] tracking-[-0.01em] text-black w-[332px] h-[68px] md:text-[36px] md:w-auto md:h-auto md:text-center sm:text-[28px]">
            Choose here!
          </h2>
          
          {/* CTA Cards */}
          <div className="flex gap-[218px] md:gap-[40px] sm:flex-col sm:gap-[20px]">
            <CTACard
              title="Analytics"
              description="You can see by yourself how we store data and how we predict it in the real time without any special roles."
              image={analyticsIcon}
              imageAlt="Analytics"
              className="w-[289px] px-[21px] py-[24px] md:w-[250px] sm:w-[280px]"
            />
            
            <CTACardTryYourself
              title="Try it yourself"
              description="You can try our system in the either role of the taxi driver or client of taxi service."
              image={tryYourselfIcon}
              imageAlt="Try Yourself"
              className="w-[289px] px-[21px] py-[31px] md:w-[250px] sm:w-[280px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-[10px] px-[544px] py-[61px] mt-[516px] h-[164px] md:mt-[300px] md:px-[40px] sm:mt-[200px] sm:px-[20px]">
          <p className="font-inter font-medium text-[17px] leading-[1.21] text-[#858898] text-center md:text-[15px] sm:text-[14px]">
            2025. All right reserved
          </p>
        </div>
      </div>
    </section>
  );
}
