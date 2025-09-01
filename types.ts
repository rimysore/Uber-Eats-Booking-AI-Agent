export enum MessageAuthor {
  USER = 'user',
  AGENT = 'agent',
}

export enum OrderStep {
  GREETING,
  PROCESSING,
  SHOWING_OPTIONS,
  CONFIRMING_ORDER,
  ORDER_PLACED,
}

export interface FoodOption {
  restaurantName: string;
  cuisine: string;
  itemName: string;
  description: string;
  price: number;
  offer?: string;
  eta: string;
  rating: number;
}

export interface Recommendation {
  itemName: string;
  restaurantName: string;
  imageUrl: string;
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  foodOptions?: FoodOption[];
  recommendations?: Recommendation[];
}

export interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  eta: string;
  offer?: string;
  imageUrl: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
}

export interface FavoriteItem {
  restaurantName: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
}

export interface User {
  name: string;
  email: string;
  orderHistory: string[];
  favorites: FavoriteItem[];
}
