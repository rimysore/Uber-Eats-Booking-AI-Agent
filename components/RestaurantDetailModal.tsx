import React, { useState, useEffect } from 'react';
import { Restaurant, FavoriteItem, MenuItem } from '../types';
import { getMenuItemsForRestaurant } from '../services/geminiService';
import { X, Star, Utensils, Info } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | FavoriteItem;
  onClose: () => void;
  onOrder: (item: MenuItem, restaurantName: string) => void;
}

const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({ restaurant, onClose, onOrder }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const name = 'name' in restaurant ? restaurant.name : restaurant.restaurantName;

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const items = await getMenuItemsForRestaurant(name);
      setMenuItems(items);
      setIsLoading(false);
    };
    fetchMenu();
  }, [name]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={restaurant.imageUrl} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">{name}</h2>
              <p className="text-lg text-gray-400">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center space-x-1 bg-gray-700 px-3 py-1.5 rounded-full">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-6 flex-1 overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Popular Items</h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                </div>
            ) : menuItems.length > 0 ? (
                <div className="space-y-4">
                    {menuItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">{item.description}</p>
                                <p className="text-base font-bold text-green-400 mt-1">${item.price.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => onOrder(item, name)}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-300 flex-shrink-0"
                            >
                                Order
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center text-gray-400 py-8 flex flex-col items-center">
                    <Info className="w-8 h-8 mb-2"/>
                    <p>Couldn't fetch menu items for this restaurant.</p>
                 </div>
            )}
        </div>

      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RestaurantDetailModal;
