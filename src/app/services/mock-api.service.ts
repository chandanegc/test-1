import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Restaurant, MenuItem } from '.././shared/models/restaurant.model';
import { LoginResponse } from '.././shared/models/user.model';
import { Order } from '.././shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  getMockRestaurants(): Restaurant[] {
    return [
      {
        id: '1',
        name: 'Pizza Paradise',
        description: 'Best pizza in town with fresh ingredients',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        cuisine: ['Italian', 'American'],
        rating: 4.5,
        totalReviews: 1200,
        deliveryTime: '20-30 min',
        deliveryFee: 2.99,
        minimumOrder: 10,
        isOpen: true,
        openingHours: this.getMockOpeningHours(),
        address: '123 Pizza St, Food City',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        menu: this.getMockMenu()
      },
      {
        id: '2',
        name: 'Sushi Master',
        description: 'Authentic Japanese sushi and sashimi',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        cuisine: ['Japanese', 'Asian'],
        rating: 4.8,
        totalReviews: 850,
        deliveryTime: '25-35 min',
        deliveryFee: 3.99,
        minimumOrder: 15,
        isOpen: true,
        openingHours: this.getMockOpeningHours(),
        address: '456 Sushi Ave, Food City',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        menu: this.getMockMenu()
      }
    ];
  }

  getMockMenu(): MenuCategory[] {
    return [
      {
        id: 'cat1',
        name: 'Popular Items',
        items: [
          {
            id: 'item1',
            name: 'Margherita Pizza',
            description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
            isVegetarian: true,
            isVegan: false,
            isSpicy: false,
            nutritionalInfo: {
              calories: 250,
              protein: 12,
              carbs: 30,
              fat: 10
            }
          },
          {
            id: 'item2',
            name: 'California Roll',
            description: 'Crab, avocado, cucumber, and sesame seeds',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
            isVegetarian: false,
            isVegan: false,
            isSpicy: false,
            nutritionalInfo: {
              calories: 300,
              protein: 8,
              carbs: 40,
              fat: 12
            }
          }
        ]
      }
    ];
  }

  getMockLoginResponse(): LoginResponse {
    return {
      user: {
        id: 'user123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'mock-jwt-token-12345',
      refreshToken: 'mock-refresh-token-67890'
    };
  }

  getMockOrders(): Order[] {
    return [
      {
        id: 'order1',
        userId: 'user123',
        restaurantId: '1',
        restaurantName: 'Pizza Paradise',
        items: [],
        subtotal: 29.98,
        deliveryFee: 2.99,
        tax: 2.40,
        total: 35.37,
        status: 'delivered',
        deliveryAddress: {
          id: 'addr1',
          type: 'home',
          street: '123 Main St',
          city: 'Food City',
          state: 'FC',
          zipCode: '12345',
          isDefault: true
        },
        paymentMethod: {
          type: 'card',
          details: { last4: '4242', brand: 'Visa' }
        },
        createdAt: new Date('2024-01-15T18:30:00'),
        estimatedDeliveryTime: new Date('2024-01-15T19:00:00'),
        trackingUpdates: []
      }
    ];
  }

  private getMockOpeningHours(): OpeningHours {
    const defaultHours: TimeRange = { open: '10:00', close: '22:00' };
    return {
      monday: defaultHours,
      tuesday: defaultHours,
      wednesday: defaultHours,
      thursday: defaultHours,
      friday: defaultHours,
      saturday: defaultHours,
      sunday: defaultHours
    };
  }
}
