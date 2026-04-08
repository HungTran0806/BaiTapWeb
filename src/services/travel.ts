import type { Destination, Itinerary } from '@/models/travel';
import { mockDestinations } from '@/models/mockData';
import axios from '@/utils/axios';

// Destination Service
export const destinationService = {
  // Get all destinations
  async getAll(): Promise<Destination[]> {
    // For demo purposes, return mock data
    // In real app, this would be: return await axios.get('/destinations');
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDestinations), 500);
    });
  },

  // Get destination by ID
  async getById(id: string): Promise<Destination> {
    const destinations = await this.getAll();
    const destination = destinations.find(d => d.id === id);
    if (!destination) {
      throw new Error('Destination not found');
    }
    return destination;
  },

  // Create new destination
  async create(destination: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> {
    const newDestination: Destination = {
      ...destination,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // In real app: return await axios.post('/destinations', destination);
    return newDestination;
  },

  // Update destination
  async update(id: string, destination: Partial<Destination>): Promise<Destination> {
    const existing = await this.getById(id);
    const updated = {
      ...existing,
      ...destination,
      updatedAt: new Date().toISOString(),
    };
    // In real app: return await axios.put(`/destinations/${id}`, destination);
    return updated;
  },

  // Delete destination
  async delete(id: string): Promise<void> {
    // In real app: await axios.delete(`/destinations/${id}`);
    console.log(`Deleted destination ${id}`);
  },

  // Upload image
  async uploadImage(file: File): Promise<string> {
    // Mock upload - in real app, upload to server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400');
      }, 1000);
    });
  },
};

// Itinerary Service
export const itineraryService = {
  // Get user's itineraries
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    const response = await axios.get(`/itineraries/user/${userId}`);
    return response.data;
  },

  // Get itinerary by ID
  async getById(id: string): Promise<Itinerary> {
    const response = await axios.get(`/itineraries/${id}`);
    return response.data;
  },

  // Create new itinerary
  async create(itinerary: Omit<Itinerary, 'id' | 'createdAt'>): Promise<Itinerary> {
    const response = await axios.post('/itineraries', itinerary);
    return response.data;
  },

  // Update itinerary
  async update(id: string, itinerary: Partial<Itinerary>): Promise<Itinerary> {
    const response = await axios.put(`/itineraries/${id}`, itinerary);
    return response.data;
  },

  // Delete itinerary
  async delete(id: string): Promise<void> {
    await axios.delete(`/itineraries/${id}`);
  },

  // Calculate budget
  calculateBudget(destinations: Destination[], days: number): number {
    return destinations.reduce((total, dest) => {
      const dailyCosts = dest.costs.food + dest.costs.accommodation + dest.costs.transportation;
      return total + (dailyCosts * days);
    }, 0);
  },

  // Calculate travel time between destinations (simplified)
  calculateTravelTime(from: Destination, to: Destination): number {
    // This is a simplified calculation - in real app, use maps API
    const baseTime = 2; // hours
    const distanceFactor = Math.random() * 2; // 0-2 hours variation
    return Math.round((baseTime + distanceFactor) * 10) / 10;
  },
};