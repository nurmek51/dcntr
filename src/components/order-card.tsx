import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KazakhstanAddressService } from '../services/addressService';
import Button from './ui/button';

interface Coordinates {
  lat: number;
  lng: number;
}

interface PassengerOrder {
  id: string;
  pickupPoint: Coordinates;
  destinationPoint: Coordinates;
  passengerInfo: {
    name: string;
    rating: number;
    phone: string;
  };
  estimatedPrice: number;
  distance: number;
  estimatedTime: string;
}

interface OrderCardProps {
  order: PassengerOrder;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAccept, onDecline }) => {
  const [pickupAddress, setPickupAddress] = useState<string>('Loading...');
  const [destinationAddress, setDestinationAddress] = useState<string>('Loading...');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const [pickup, destination] = await Promise.all([
          KazakhstanAddressService.reverseGeocode(order.pickupPoint),
          KazakhstanAddressService.reverseGeocode(order.destinationPoint)
        ]);
        setPickupAddress(pickup);
        setDestinationAddress(destination);
      } catch (error) {
        console.warn('Failed to load addresses:', error);
        setPickupAddress(`${order.pickupPoint.lat.toFixed(4)}, ${order.pickupPoint.lng.toFixed(4)}`);
        setDestinationAddress(`${order.destinationPoint.lat.toFixed(4)}, ${order.destinationPoint.lng.toFixed(4)}`);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [order.pickupPoint, order.destinationPoint]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-[20px] shadow-xl p-6 border border-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          rotate: [360, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-xl"
      />
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#94EA0D] to-[#7DD3FC] rounded-full flex items-center justify-center shadow-xl border-2 border-white relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="font-['Press_Start_2P'] text-[14px] text-black relative z-10">
                {order.passengerInfo.name.charAt(0)}
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 bg-gradient-to-r from-[#94EA0D]/30 to-[#7DD3FC]/30 rounded-full blur-sm -z-10"
            />
          </motion.div>
          <div>
            <motion.h3 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-poppins font-bold text-[17px] text-black mb-1"
            >
              {order.passengerInfo.name}
            </motion.h3>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200/50"
            >
              <motion.span 
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-yellow-500 text-[14px]"
              >
                ⭐
              </motion.span>
              <span className="font-poppins font-semibold text-[13px] text-yellow-700">
                {order.passengerInfo.rating.toFixed(1)}
              </span>
            </motion.div>
          </div>
        </div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-right"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="font-['Press_Start_2P'] text-[16px] bg-gradient-to-r from-[#94EA0D] to-[#7DD3FC] bg-clip-text text-transparent drop-shadow-sm mb-1">
              {order.estimatedPrice} ₸
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 bg-gradient-to-r from-[#94EA0D]/20 to-[#7DD3FC]/20 rounded blur-sm -z-10"
            />
          </motion.div>
          <div className="font-poppins text-[12px] text-gray-600 bg-gray-50 px-2 py-1 rounded-full border border-gray-200/50">
            {order.distance.toFixed(1)} km • {order.estimatedTime}
          </div>
        </motion.div>
      </motion.div>

      {/* Route Information */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-4 mb-8 relative z-10"
      >
        {/* Connecting line */}
        <div className="absolute left-[18px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-red-400 rounded-full opacity-60"></div>
        
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-start gap-4 relative"
        >
          <motion.div 
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg border-2 border-white flex-shrink-0 mt-1">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-green-400/30 rounded-full blur-sm"
              />
            </div>
          </motion.div>
          <div className="flex-1 bg-green-50/80 backdrop-blur-sm p-3 rounded-[12px] border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">📍</span>
              <p className="font-['Press_Start_2P'] text-[10px] text-green-700 uppercase tracking-wide">Pickup Location</p>
            </div>
            <p className="font-poppins text-[14px] text-gray-800 font-medium leading-relaxed">
              {isLoadingAddresses ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-green-600"
                >
                  Loading address...
                </motion.span>
              ) : pickupAddress}
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-start gap-4 relative"
        >
          <motion.div 
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-lg border-2 border-white flex-shrink-0 mt-1">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 bg-red-400/30 rounded-full blur-sm"
              />
            </div>
          </motion.div>
          <div className="flex-1 bg-red-50/80 backdrop-blur-sm p-3 rounded-[12px] border border-red-200/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">🎯</span>
              <p className="font-['Press_Start_2P'] text-[10px] text-red-700 uppercase tracking-wide">Destination</p>
            </div>
            <p className="font-poppins text-[14px] text-gray-800 font-medium leading-relaxed">
              {isLoadingAddresses ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-red-600"
                >
                  Loading address...
                </motion.span>
              ) : destinationAddress}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex gap-4 relative z-10"
      >
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)",
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAccept(order.id)}
          className="flex-1 relative overflow-hidden bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] text-white py-4 px-6 rounded-[16px] font-poppins font-semibold text-[14px] shadow-xl border border-white/20 backdrop-blur-sm group"
        >
          {/* Animated background */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          
          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-[16px]"
            >
              ✓
            </motion.span>
            <span className="font-['Press_Start_2P'] text-[10px] uppercase tracking-wider">Accept Order</span>
          </div>
        </motion.button>
        
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(107, 114, 128, 0.3)",
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDecline(order.id)}
          className="flex-1 relative overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-700 py-4 px-6 rounded-[16px] font-poppins font-semibold text-[14px] shadow-xl border border-gray-300/50 backdrop-blur-sm group hover:from-gray-200 hover:via-gray-300 hover:to-gray-200 transition-all duration-300"
        >
          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            <motion.span
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="text-[16px]"
            >
              ✕
            </motion.span>
            <span className="font-['Press_Start_2P'] text-[10px] uppercase tracking-wider">Decline</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default OrderCard;
