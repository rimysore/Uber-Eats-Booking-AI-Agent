import React, { useRef, useEffect } from 'react';
import { X, Bot, User as UserIcon } from 'lucide-react';
import { ChatMessage, MessageAuthor, OrderStep, User, FoodOption } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import LoadingSpinner from './LoadingSpinner';
import FilterControls from './FilterControls';
import Suggestions from './Suggestions';
import ChatInput from './ChatInput';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatHistory: ChatMessage[];
    isLoading: boolean;
    orderStep: OrderStep;
    onSendMessage: (message: string) => void;
    onSelectOption: (option: FoodOption) => void;
    onReset: () => void;
    minPrice: string;
    maxPrice: string;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    currentUser: User;
    onToggleFavorite: (option: FoodOption) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    onClose,
    chatHistory,
    isLoading,
    orderStep,
    onSendMessage,
    onSelectOption,
    onReset,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    currentUser,
    onToggleFavorite
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Bot className="h-6 w-6 text-green-400" />
                        <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Close chat"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {chatHistory.map((msg, index) => (
                        <ChatMessageBubble
                            key={index}
                            message={msg}
                            onSelectOption={onSelectOption}
                            favorites={currentUser.favorites}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                    {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1]?.author === MessageAuthor.USER && (
                        <div className="flex justify-start items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="p-3 bg-gray-700 rounded-lg flex items-center space-x-2">
                                <LoadingSpinner />
                                <span className="text-gray-300 italic">Finding the best deals...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </main>

                <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 p-4">
                    {orderStep === OrderStep.ORDER_PLACED && (
                        <button
                            onClick={onReset}
                            className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                            New Order
                        </button>
                    )}
                    {orderStep !== OrderStep.ORDER_PLACED && (
                        <>
                            <FilterControls
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                onMinPriceChange={onMinPriceChange}
                                onMaxPriceChange={onMaxPriceChange}
                                disabled={isLoading}
                            />
                            <Suggestions onSelect={onSendMessage} />
                        </>
                    )}
                    <ChatInput
                        onSendMessage={onSendMessage}
                        disabled={isLoading || orderStep === OrderStep.ORDER_PLACED}
                    />
                </footer>
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

export default ChatModal;
