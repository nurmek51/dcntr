import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = "Loading...",
  message = "Please wait while we fetch the data"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#FFFEE9] rounded-[20px] p-8 shadow-[8px_10px_20px_rgba(0,0,0,0.2)] max-w-md mx-4"
          >
            {/* Loading Animation */}
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Circles */}
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 border-4 border-gray-200 rounded-full"
                />
                <motion.div
                  className="absolute inset-0 border-4 border-black border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 border-2 border-gray-300 border-b-transparent rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Pulsing Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-black rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                ))}
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2">
                <motion.h3
                  className="font-bold text-[20px] text-black"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {title}
                </motion.h3>
                <p className="text-[14px] text-[#858898] max-w-xs">
                  {message}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-black via-gray-600 to-black rounded-full"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;
