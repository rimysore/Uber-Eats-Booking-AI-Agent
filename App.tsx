
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, MessageAuthor, OrderStep, FoodOption, User, FavoriteItem, Restaurant, MenuItem } from './types';
import ChatInput from './components/ChatInput';
import ChatMessageBubble from './components/ChatMessageBubble';
import LoadingSpinner from './components/LoadingSpinner';
import Suggestions from './components/Suggestions';
import ProfileModal from './components/ProfileModal';
import AuthPage from './AuthPage';
import FilterControls from './components/FilterControls';
import { findFoodOptions, getDashboardRestaurants, getMenuItemsForRestaurant, getPersonalizedRecommendations } from './services/geminiService';
import { UtensilsCrossed, User as UserIcon, LogOut, Heart } from 'lucide-react';
import Tabs from './components/Tabs';
import RestaurantCard from './components/RestaurantCard';
import FloatingChatButton from './components/FloatingChatButton';
import ChatModal from './components/ChatModal';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import SearchBar from './components/SearchBar';

type ActiveTab = 'discover' | 'offers' | 'favorites';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modal States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Dashboard State
  // FIX: Corrected the useState declaration for activeTab. It had an extra '=' and the setter was misnamed.
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | FavoriteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Chat State
  const [orderStep, setOrderStep] = useState<OrderStep>(OrderStep.GREETING);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchDashboardContent(activeTab, currentUser);
      setOrderHistory(currentUser.orderHistory);
    }
  }, [isAuthenticated, currentUser, activeTab]);

  const fetchDashboardContent = async (tab: ActiveTab, user: User) => {
    if (tab === 'favorites') {
      setRestaurants([]); // Favorites are read directly from user object
      return;
    }
    setIsDashboardLoading(true);
    setRestaurants([]);
    try {
      const fetchedRestaurants = await getDashboardRestaurants(user, tab);
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error(`Error fetching ${tab} restaurants:`, error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Initial greeting for chat
    setChatHistory([
      {
        author: MessageAuthor.AGENT,
        text: `Hello ${user.name}! I'm your personal AI assistant. Click here or use the dashboard to find something to eat.`,
      },
    ]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setChatHistory([]);
    setOrderHistory([]);
    setRestaurants([]);
  };

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsChatLoading(true);
    setOrderStep(OrderStep.PROCESSING);

    try {
      const priceRange = {
        min: minPrice ? parseFloat(minPrice) : undefined,
        max: maxPrice ? parseFloat(maxPrice) : undefined,
      };
      
      const agentThinkingMessage: ChatMessage = { author: MessageAuthor.AGENT, text: "" };
      setChatHistory((prev) => [...prev, agentThinkingMessage]);

      const result = await findFoodOptions(userInput, orderHistory, priceRange);

      if (typeof result === 'string') {
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = result;
            return newHistory;
        });
        setIsChatLoading(false);
      } else {
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = "I've found a few great options for you. Take a look!";
            newHistory[newHistory.length - 1].foodOptions = result;
            return newHistory;
        });
        setIsChatLoading(false);
        setOrderStep(OrderStep.SHOWING_OPTIONS);
      }
    } catch (error) {
      console.error("Error fetching food options:", error);
      const errorMessage: ChatMessage = {
        author: MessageAuthor.AGENT,
        text: "I'm sorry, I'm having trouble connecting to my services right now. Please try again in a moment.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      setIsChatLoading(false);
    }
  };

  const handleSelectOption = (option: FoodOption) => {
    if (orderStep !== OrderStep.SHOWING_OPTIONS) return;

    const userConfirmation: ChatMessage = {
      author: MessageAuthor.USER,
      text: `Sounds great! I'll go with the ${option.itemName} from ${option.restaurantName}.`,
    };
    setChatHistory((prev) => [...prev, userConfirmation]);
    setOrderHistory((prev) => [...prev, option.itemName]);
    setIsChatLoading(true);
    setOrderStep(OrderStep.CONFIRMING_ORDER);

    setTimeout(() => {
      const orderPlacedMessage: ChatMessage = {
        author: MessageAuthor.AGENT,
        text: `Excellent choice! I've placed your order for the ${option.itemName} from ${option.restaurantName}. It should arrive in about ${option.eta}. Enjoy your meal!`,
      };
      const emailConfirmation: ChatMessage = {
        author: MessageAuthor.AGENT,
        text: `A confirmation email has been sent to ${currentUser?.email}.`,
      }
      setChatHistory((prev) => [...prev, orderPlacedMessage, emailConfirmation]);
      setOrderStep(OrderStep.ORDER_PLACED);
      setIsChatLoading(false);
    }, 2000);
  };
  
  const handleStartOrderFromDetail = (item: MenuItem, restaurantName: string) => {
    setIsDetailOpen(false);
    setIsChatOpen(true);
    
    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: `I'd like to order the ${item.name} from ${restaurantName}`};
    const agentMessage: ChatMessage = { author: MessageAuthor.AGENT, text: `Placing your order for ${item.name}...`};

    setChatHistory(prev => [...prev, userMessage, agentMessage]);
    setIsChatLoading(true);
    setOrderStep(OrderStep.CONFIRMING_ORDER);

    setTimeout(() => {
       const orderPlacedMessage: ChatMessage = {
        author: MessageAuthor.AGENT,
        text: `Excellent choice! I've placed your order for the ${item.name} from ${restaurantName}. It should arrive in about 30-40 min. Enjoy your meal!`,
      };
       const emailConfirmation: ChatMessage = {
        author: MessageAuthor.AGENT,
        text: `A confirmation email has been sent to ${currentUser?.email}.`,
      }
      setChatHistory((prev) => [...prev, orderPlacedMessage, emailConfirmation]);
      setOrderStep(OrderStep.ORDER_PLACED);
      setIsChatLoading(false);
    }, 2000);
  }

  const handleChatReset = () => {
    if (!currentUser) return;
    setOrderStep(OrderStep.GREETING);
    setChatHistory([
      {
        author: MessageAuthor.AGENT,
        text: "Let's order something else! What are you craving now?",
      },
    ]);
  };
  
  const handleToggleFavorite = (item: FoodOption) => {
    if (!currentUser) return;

    setCurrentUser(prevUser => {
      if (!prevUser) return null;

      const isAlreadyFavorite = prevUser.favorites.some(
        fav => fav.restaurantName === item.restaurantName
      );

      let newFavorites: FavoriteItem[];

      if (isAlreadyFavorite) {
        newFavorites = prevUser.favorites.filter(
          fav => fav.restaurantName !== item.restaurantName
        );
      } else {
        const newFavorite: FavoriteItem = {
            restaurantName: item.restaurantName,
            cuisine: item.cuisine,
            rating: item.rating,
            imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 1}/600/400`
        };
        newFavorites = [...prevUser.favorites, newFavorite];
      }
      
      return { ...prevUser, favorites: newFavorites };
    });
  };

  const handleCardClick = (restaurant: Restaurant | FavoriteItem) => {
    setSelectedRestaurant(restaurant);
    setIsDetailOpen(true);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setSearchQuery('');
    setActiveTab(tab);
  };

  const filteredResults = useMemo(() => {
    const sourceList = activeTab === 'favorites' ? currentUser!.favorites : restaurants;
    
    if (!searchQuery) {
      return sourceList;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return sourceList.filter(r => {
      const name = 'name' in r ? r.name : r.restaurantName;
      return name.toLowerCase().includes(lowercasedQuery) || r.cuisine.toLowerCase().includes(lowercasedQuery);
    });
  }, [searchQuery, restaurants, currentUser?.favorites, activeTab]);


  if (!isAuthenticated || !currentUser) {
    return <AuthPage onAuth={handleLogin} />;
  }

  const renderContent = () => {
    if (isDashboardLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (filteredResults.length === 0) {
        if (searchQuery) {
            return <p className="text-center text-gray-400 mt-8">No results found for "{searchQuery}".</p>;
        }
        if (activeTab === 'favorites') {
            return <p className="text-center text-gray-400 mt-8">You haven't added any favorite restaurants yet.</p>;
        }
        return <p className="text-center text-gray-400 mt-8">No restaurants found in this category.</p>;
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((res, index) => (
                <RestaurantCard key={`${'name' in res ? res.name : res.restaurantName}-${index}`} restaurant={res} onClick={() => handleCardClick(res)} />
            ))}
        </div>
    );
  };

  return (
    <>
      {isProfileOpen && <ProfileModal user={currentUser} onClose={() => setIsProfileOpen(false)} />}
      {isDetailOpen && selectedRestaurant && (
        <RestaurantDetailModal 
            restaurant={selectedRestaurant}
            onClose={() => setIsDetailOpen(false)}
            onOrder={handleStartOrderFromDetail}
        />
      )}
      {isChatOpen && (
        <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            chatHistory={chatHistory}
            isLoading={isChatLoading}
            orderStep={orderStep}
            onSendMessage={handleSendMessage}
            onSelectOption={handleSelectOption}
            onReset={handleChatReset}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            currentUser={currentUser}
            onToggleFavorite={handleToggleFavorite}
        />
      )}
      
      <div className="flex flex-col h-screen bg-gray-900 font-sans">
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg flex items-center justify-between z-20 sticky top-0">
          <div className="flex items-center space-x-3">
            <UtensilsCrossed className="h-8 w-8 text-green-400" />
            <h1 className="text-xl font-bold text-gray-100">Uber Eats AI Agent</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsProfileOpen(true)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <UserIcon className="h-6 w-6 text-gray-300"/>
            </button>
             <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <LogOut className="h-6 w-6 text-red-400"/>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
             <div className="my-6">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div>
                {renderContent()}
            </div>
        </main>
        
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      </div>
    </>
  );
};

export default App;
