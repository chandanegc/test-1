import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { MockApiService } from './mock-api.service';
import { Restaurant, MenuItem, CuisineType, MenuCategory } from '../shared/models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly apiService = inject(ApiService);
  private readonly mockApiService = inject(MockApiService);

  private readonly restaurantsSignal = signal<Restaurant[]>([]);
  private readonly selectedRestaurantSignal = signal<Restaurant | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly filtersSignal = signal<RestaurantFilters>({
    cuisine: [],
    rating: 0,
    priceRange: null,
    deliveryTime: null
  });

  readonly restaurants = this.restaurantsSignal.asReadonly();
  readonly selectedRestaurant = this.selectedRestaurantSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();

  getRestaurants(filters?: Partial<RestaurantFilters>): Observable<Restaurant[]> {
    this.loadingSignal.set(true);

    const params: any = {};
    if (filters?.cuisine?.length) {
      params.cuisine = filters.cuisine.join(',');
    }
    if (filters?.rating) {
      params.minRating = filters.rating;
    }
    if (filters?.deliveryTime) {
      params.maxDeliveryTime = filters.deliveryTime;
    }

    return this.apiService.get<Restaurant[]>('restaurants', { params }).pipe(
      map(restaurants => {
        this.restaurantsSignal.set(restaurants);
        this.loadingSignal.set(false);
        return restaurants;
      }),
      catchError(() => {
        console.log('API failed, using mock data');
        const mockRestaurants = this.mockApiService.getMockRestaurants();
        this.restaurantsSignal.set(mockRestaurants);
        this.loadingSignal.set(false);
        return of(mockRestaurants);
      })
    );
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    this.loadingSignal.set(true);

    return this.apiService.get<Restaurant>(`restaurants/${id}`).pipe(
      map(restaurant => {
        this.selectedRestaurantSignal.set(restaurant);
        this.loadingSignal.set(false);
        return restaurant;
      }),
      catchError(() => {
        console.log('API failed, using mock data');
        const mockRestaurants = this.mockApiService.getMockRestaurants();
        const restaurant = mockRestaurants[0];
        this.selectedRestaurantSignal.set(restaurant);
        this.loadingSignal.set(false);
        return of(restaurant);
      })
    );
  }

  getFeaturedRestaurants(): Observable<Restaurant[]> {
    return this.apiService.get<Restaurant[]>('restaurants/featured').pipe(
      catchError(() => of(this.mockApiService.getMockRestaurants()))
    );
  }

  searchRestaurants(query: string): Observable<Restaurant[]> {
    return this.apiService.get<Restaurant[]>('restaurants/search', {
      params: { q: query }
    }).pipe(
      catchError(() => of(this.mockApiService.getMockRestaurants()))
    );
  }

  getMenuItem(restaurantId: string, itemId: string): Observable<MenuItem> {
    return this.apiService.get<MenuItem>(`restaurants/${restaurantId}/menu/${itemId}`).pipe(
      catchError(() => {
        const mockMenu = this.mockApiService.getMockMenu();
        const item = mockMenu[0]?.items?.[0];
        return of(item || {} as MenuItem);
      })
    );
  }

  updateFilters(filters: Partial<RestaurantFilters>): void {
    this.filtersSignal.update(current => ({ ...current, ...filters }));
    this.getRestaurants(this.filtersSignal()).subscribe();
  }

  clearFilters(): void {
    this.filtersSignal.set({
      cuisine: [],
      rating: 0,
      priceRange: null,
      deliveryTime: null
    });
    this.getRestaurants().subscribe();
  }
}

interface RestaurantFilters {
  cuisine: CuisineType[];
  rating: number;
  priceRange: PriceRange | null;
  deliveryTime: number | null;
}

type PriceRange = '$' | '$$' | '$$$' | '$$$$';
