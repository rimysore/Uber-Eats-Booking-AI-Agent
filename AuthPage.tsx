import React, { useState } from 'react';
import { User as UserType } from './types';
import { UtensilsCrossed, LogIn } from 'lucide-react';

interface AuthPageProps {
  onAuth: (user: UserType) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    const mockUser = {
        name: isLogin ? 'Valued Customer' : name,
        email,
        orderHistory: isLogin ? ['Spicy Tuna Roll', 'Pepperoni Pizza', 'Classic Cheeseburger'] : [],
        favorites: isLogin ? [
          {
            restaurantName: 'Burger Palace',
            cuisine: 'American',
            rating: 4.5,
            imageUrl: 'https://picsum.photos/id/111/600/400'
          },
          {
            restaurantName: 'Sushi World',
            cuisine: 'Japanese',
            rating: 4.8,
            imageUrl: 'https://picsum.photos/id/222/600/400'
          }
        ] : [],
    };
    onAuth(mockUser);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-green-400" />
          <h1 className="mt-4 text-3xl font-bold">Welcome to the AI Agent</h1>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
            >
              <LogIn className="w-5 h-5 mr-2 -ml-1" />
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-2 font-medium text-green-400 hover:text-green-300"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
