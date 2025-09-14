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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[16px] shadow-[3px_4px_4px_rgba(0,0,0,0.15)] p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="font-bold text-[18px] text-gray-600">
              {order.passengerInfo.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-[16px] text-black">
              {order.passengerInfo.name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-[14px] text-[#858898]">★</span>
              <span className="text-[14px] text-[#858898]">
                {order.passengerInfo.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-[18px] text-green-600">
            {order.estimatedPrice} ₸
          </div>
          <div className="text-[12px] text-[#858898]">
            {order.distance.toFixed(1)} km • {order.estimatedTime}
          </div>
        </div>
      </div>

      {/* Route Information */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-[12px] text-[#858898] mb-1">Pickup</p>
            <p className="text-[14px] text-black">
              {isLoadingAddresses ? 'Loading address...' : pickupAddress}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-[12px] text-[#858898] mb-1">Destination</p>
            <p className="text-[14px] text-black">
              {isLoadingAddresses ? 'Loading address...' : destinationAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onDecline(order.id)}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          Decline
        </Button>
        <Button
          onClick={() => onAccept(order.id)}
          variant="primary"
          size="sm"
          className="flex-1"
        >
          Accept
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderCard;
