import React from 'react';
import { Restaurant, FavoriteItem } from '../types';
import { Star, Tag, Clock } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant | FavoriteItem;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const name = 'name' in restaurant ? restaurant.name : restaurant.restaurantName;
  const offer = 'offer' in restaurant ? restaurant.offer : undefined;
  const eta = 'eta' in restaurant ? restaurant.eta : undefined;
  
  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-xl overflow-hidden group cursor-pointer transform hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-700/50 hover:border-green-500/50"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img src={restaurant.imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
         {offer && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>{offer}</span>
            </div>
         )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white truncate">{name}</h3>
            <p className="text-sm text-gray-400">{restaurant.cuisine}</p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full text-sm">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-white">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        {eta && (
             <div className="flex items-center space-x-1 text-gray-400 mt-3 text-sm">
                <Clock className="h-4 w-4" />
                <span>{eta}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
