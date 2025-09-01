import React from 'react';
import { Zap } from 'lucide-react';

interface SuggestionsProps {
  onSelect: (suggestion: string) => void;
}

const frequentOrders = [
  'A classic cheeseburger',
  'Spicy tuna roll',
  'Chicken Pad Thai',
  'Pepperoni pizza',
];

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
        Quick Suggestions
      </h3>
      <div className="flex flex-wrap gap-2">
        {frequentOrders.map((order) => (
          <button
            key={order}
            onClick={() => onSelect(order)}
            className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
          >
            {order}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
