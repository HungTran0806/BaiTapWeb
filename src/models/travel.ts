// Destination model
export interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'beach' | 'mountain' | 'city' | 'other';
  image: string;
  rating: number;
  visitDuration: number; // hours
  costs: {
    food: number;
    accommodation: number;
    transportation: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Itinerary model
export interface ItineraryItem {
  id: string;
  destinationId: string;
  day: number;
  order: number;
  notes?: string;
}

export interface Itinerary {
  id: string;
  name: string;
  userId: string;
  items: ItineraryItem[];
  totalBudget: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

// Budget category
export interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

// User preferences
export interface UserPreferences {
  currency: string;
  language: string;
  notifications: boolean;
}