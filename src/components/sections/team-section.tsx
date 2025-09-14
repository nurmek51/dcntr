import React from 'react';
import { motion } from 'framer-motion';
import shape1 from '../../assets/shape1.svg';
import shape2 from '../../assets/shape2.svg';
import askhatImg from '../../assets/askhat.png';
import daniyarImg from '../../assets/daniyar.png';
import nurmekImg from '../../assets/nurmek.png';
import omarImg from '../../assets/omar.png';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin: string;
  github: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Samedulla Askhat",
    role: "ML Engineer",
    description: "Machine learning specialist focused on developing intelligent solutions and data-driven applications. Expert in AI/ML algorithms and model optimization.",
    image: askhatImg,
    linkedin: "https://www.linkedin.com/in/askhat-samedulla/",
    github: "https://github.com/l9kk"
  },
  {
    id: 2,
    name: "Nurmukhamed Maksatuly",
    role: "Full-Stack Developer",
    description: "Versatile full-stack developer with expertise in both frontend and backend technologies. Passionate about creating seamless user experiences.",
    image: nurmekImg,
    linkedin: "https://www.linkedin.com/in/nurmek51/",
    github: "https://github.com/nurmek51"
  },
  {
    id: 3,
    name: "Omar Sembek",
    role: "Full-Stack + UX/UI Designer",
    description: "Full-stack developer with strong design skills. Combines technical expertise with creative vision to build beautiful and functional applications.",
    image: omarImg,
    linkedin: "https://www.linkedin.com/in/omar-sembek/",
    github: "https://github.com/sup1p"
  },
  {
    id: 4,
    name: "Otesh Daniyar",
    role: "Full-Stack + UX/UI Designer",
    description: "Full-stack developer and UX/UI designer who bridges the gap between design and development. Creates intuitive interfaces backed by solid code.",
    image: daniyarImg,
    linkedin: "https://www.linkedin.com/in/daniyar-otesh/",
    github: "https://github.com/tortugichh"
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="relative w-full h-full bg-[#fffee9] overflow-hidden flex items-center justify-center">
      {/* Background Decorative Shapes */}
      <motion.img
        src={shape1}
        alt=""
        className="absolute left-[-120px] top-[50px]  w-[280px] h-[350px]"
        initial={{ opacity: 0, x: -100}}
        animate={{ opacity: 0.6, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      />
      
      <motion.img
        src={shape2}
        alt=""
        className="absolute right-[-80px] bottom-[80px]  w-[220px] h-[380px]"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 w-full h-full px-4 py-20">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="font-['Press_Start_2P',_monospace] text-[46px] text-black text-center max-w-[660px] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet Our Team
          </motion.h2>
          <motion.p
            className="text-lg text-[#858898] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Our passionate team of developers.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 max-w-8xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-10 group hover:-translate-y-2 min-h-[420px] w-full max-w-[320px] mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Profile Image */}
              <div className="relative mb-8">
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-gray-100 group-hover:border-blue-300 transition-colors duration-300"
                  whileHover={{ rotate: 5 }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Member Info */}
              <div className="text-center mb-8">
                <h3 className="font-bold text-[26px] text-black mb-3">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4 text-[18px]">{member.role}</p>
                <p className="text-[#858898] text-[16px] leading-relaxed">{member.description}</p>
              </div>

              {/* Social Links */}
              <div className="flex  justify-center  space-x-4">
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                <motion.a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        
      </div>
    </section>
  );
};

export default TeamSection;