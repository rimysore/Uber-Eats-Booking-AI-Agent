import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 z-40"
      aria-label="Open AI Assistant"
    >
      <MessageSquare className="w-8 h-8" />
    </button>
  );
};

export default FloatingChatButton;
