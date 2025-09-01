import React from 'react';
import { FoodOption } from '../types';
import { Star, Tag, Clock, Heart } from 'lucide-react';

interface FoodOptionCardProps {
  option: FoodOption;
  onSelect: (option: FoodOption) => void;
  isFavorite: boolean;
  onToggleFavorite: (option: FoodOption) => void;
}

const FoodOptionCard: React.FC<FoodOptionCardProps> = ({ option, onSelect, isFavorite, onToggleFavorite }) => {
  const imageId = Math.floor(Math.random() * 200) + 1; // Random image from picsum

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out border border-gray-700">
       <button
        onClick={() => onToggleFavorite(option)}
        className="absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
      </button>
      <img src={`https://picsum.photos/id/${imageId}/600/300`} alt={option.itemName} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">{option.itemName}</h3>
            <p className="text-sm text-gray-400">{option.restaurantName}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">{option.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-gray-300 my-3 text-sm">{option.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-400 my-4">
          {option.offer && (
            <div className="flex items-center space-x-1 text-green-400">
              <Tag className="h-4 w-4" />
              <span>{option.offer}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{option.eta}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-white">${option.price.toFixed(2)}</p>
          <button
            onClick={() => onSelect(option)}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-300"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOptionCard;
