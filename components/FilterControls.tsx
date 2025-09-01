import React from 'react';

interface FilterControlsProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  disabled: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  disabled,
}) => {
  return (
    <div className="mb-3 p-3 bg-gray-700/50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-400 flex items-center mb-2">
        Filter by Price
      </h3>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            $
          </span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            disabled={disabled}
            className="w-full pl-7 pr-2 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
            aria-label="Minimum price"
            min="0"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
           <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            $
          </span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            disabled={disabled}
            className="w-full pl-7 pr-2 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
            aria-label="Maximum price"
            min={minPrice || "0"}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
