
import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const placeholderText = disabled ? "Waiting for response..." : "e.g., 'I want a spicy chicken sandwich with fries'";

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 md:space-x-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholderText}
        disabled={disabled}
        className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="p-3 bg-green-500 rounded-lg text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
      >
        <SendHorizonal className="h-6 w-6" />
      </button>
    </form>
  );
};

export default ChatInput;
