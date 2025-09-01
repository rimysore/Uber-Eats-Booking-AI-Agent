import React from 'react';
import { Compass, Tag, Heart } from 'lucide-react';

type ActiveTab = 'discover' | 'offers' | 'favorites';

interface TabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  isActive
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-gray-500'}`}/>
                <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
