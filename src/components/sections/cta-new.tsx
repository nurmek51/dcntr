import React from "react";
import bgShape from "../../assets/Vector 3.svg"; // твой SVG фон
import analyticsImg from "../../assets/analytics-icon.png"; // картинка для Analytics
import tryImg from "../../assets/try-yourself-icon.png"; // картинка для Try it yourself

interface OptionCardProps {
  title: string;
  description: string;
  buttonText: string;
  image: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, description, buttonText, image }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 w-[280px] flex flex-col items-center text-center">
      {/* Картинка сверху */}
      <img src={image} alt={title} className="w-20 h-20 object-contain mb-4" />

      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <button className="bg-lime-400 hover:bg-lime-500 font-bold rounded-lg px-4 py-2 shadow-md">
        {buttonText}
      </button>
    </div>
  );
};

const ChooseSection: React.FC = () => {
  return (
    <div className="relative w-full bg-[#fffde9]  py-24 overflow-hidden">
      {/* Фон SVG */}
      <div className="absolute inset-0">
        <img
          src={bgShape}
          alt="background shape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Контент */}
      <div className="relative flex flex-col items-center z-10">
        <h2 className="text-3xl font-bold mb-12">Choose here!</h2>

        <div className="flex gap-10 flex-wrap justify-center">
          <OptionCard
            title="Analytics"
            description="You can see by yourself how we store data and how we predict it in real time without any special roles."
            buttonText="Analytics"
            image={analyticsImg}
          />
          <OptionCard
            title="Try it yourself"
            description="You can try our system in the role of the taxi driver or client of taxi service."
            buttonText="Try it yourself"
            image={tryImg}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseSection;
