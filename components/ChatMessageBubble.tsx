import React from 'react';
import { ChatMessage, MessageAuthor, FoodOption, FavoriteItem } from '../types';
import FoodOptionCard from './FoodOptionCard';
import { User, Bot } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSelectOption: (option: FoodOption) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (option: FoodOption) => void;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onSelectOption, favorites, onToggleFavorite }) => {
  const isUser = message.author === MessageAuthor.USER;

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end rounded-l-lg rounded-tr-lg'
    : 'bg-gray-700 text-gray-200 self-start rounded-r-lg rounded-tl-lg';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  const Icon = isUser ? User : Bot;
  const iconBg = isUser ? 'bg-blue-600' : 'bg-green-500';

  return (
    <div className={`w-full max-w-xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${iconBg} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white"/>
            </div>
            <div className="flex flex-col space-y-3 w-full">
              <div className={`p-4 shadow-md ${bubbleClasses}`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
              </div>

              {message.foodOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {message.foodOptions.map((option, index) => {
                    const isFavorite = favorites.some(
                      (fav) => fav.restaurantName === option.restaurantName
                    );
                    return (
                      <FoodOptionCard 
                        key={index} 
                        option={option} 
                        onSelect={onSelectOption}
                        isFavorite={isFavorite}
                        onToggleFavorite={onToggleFavorite} 
                      />
                    );
                  })}
                  </div>
              )}
            </div>
        </div>
    </div>
  );
};

export default ChatMessageBubble;
