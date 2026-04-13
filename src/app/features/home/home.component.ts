import { RestaurantService } from './../../services/restaurant.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Restaurant } from '../../shared/models/restaurant.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__content">
          <h1 class="hero__title">Delicious food delivered to your door</h1>
          <p class="hero__subtitle">Order from your favorite restaurants</p>
          <div class="hero__search">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              (input)="onSearch($event)"
              class="hero__search-input"
            >
          </div>
        </div>
      </section>

      <!-- Featured Restaurants -->
      <section class="section">
        <div class="container">
          <h2 class="section__title">Featured Restaurants</h2>
          <div class="restaurant-grid">
            @for (restaurant of featuredRestaurants(); track restaurant.id) {
              <div class="restaurant-card" [routerLink]="['/restaurant', restaurant.id]">
                <img [src]="restaurant.image" [alt]="restaurant.name" class="restaurant-card__image">
                <div class="restaurant-card__content">
                  <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                  <p class="restaurant-card__cuisine">{{ restaurant.cuisine.join(', ') }}</p>
                  <div class="restaurant-card__info">
                    <span class="rating">⭐ {{ restaurant.rating }}</span>
                    <span class="delivery-time">🕒 {{ restaurant.deliveryTime }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- All Restaurants -->
      <section class="section">
        <div class="container">
          <h2 class="section__title">All Restaurants</h2>

          <!-- Filters -->
          <div class="filters">
            <select (change)="onCuisineFilter($event)" class="filter-select">
              <option value="">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
            </select>

            <select (change)="onRatingFilter($event)" class="filter-select">
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <!-- Loading State -->
          @if (loading()) {
            <div class="loading">
              <div class="spinner"></div>
              <p>Loading restaurants...</p>
            </div>
          }

          <!-- Restaurants Grid -->
          @if (!loading()) {
            <div class="restaurant-grid">
              @for (restaurant of restaurants(); track restaurant.id) {
                <div class="restaurant-card" [routerLink]="['/restaurant', restaurant.id]">
                  <img [src]="restaurant.image" [alt]="restaurant.name" class="restaurant-card__image">
                  <div class="restaurant-card__content">
                    <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                    <p class="restaurant-card__cuisine">{{ restaurant.cuisine.join(', ') }}</p>
                    <div class="restaurant-card__info">
                      <span class="rating">⭐ {{ restaurant.rating }}</span>
                      <span class="delivery-time">🕒 {{ restaurant.deliveryTime }}</span>
                      <span class="delivery-fee">🚚 {{ restaurant.deliveryFee === 0 ? 'Free' : (restaurant.deliveryFee | currency) }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }

    .hero__title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .hero__subtitle {
      font-size: 20px;
      margin-bottom: 32px;
      opacity: 0.9;
    }

    .hero__search {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero__search-input {
      width: 100%;
      padding: 16px 24px;
      font-size: 18px;
      border: none;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      &:focus {
        outline: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
    }

    .section {
      padding: 60px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section__title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 32px;
      color: #333;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .filter-select {
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #667eea;
      }
    }

    .restaurant-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .restaurant-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }
    }

    .restaurant-card__image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .restaurant-card__content {
      padding: 16px;
    }

    .restaurant-card__name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .restaurant-card__cuisine {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }

    .restaurant-card__info {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #666;
    }

    .rating {
      color: #f39c12;
      font-weight: 600;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class HomeComponent implements OnInit {
  private restaurantService = inject(RestaurantService);

  readonly restaurants = this.restaurantService.restaurants;
  readonly loading = this.restaurantService.loading;

  featuredRestaurants = signal<Restaurant[]>([]);
  private searchTimeout: any;

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadFeaturedRestaurants();
  }

  private loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe();
  }

  private loadFeaturedRestaurants(): void {
    this.restaurantService.getFeaturedRestaurants().subscribe({
      next: (restaurants) => this.featuredRestaurants.set(restaurants),
      error: (error) => console.error('Failed to load featured restaurants:', error)
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (query) {
        this.restaurantService.searchRestaurants(query).subscribe();
      } else {
        this.loadRestaurants();
      }
    }, 300);
  }

  onCuisineFilter(event: Event): void {
    const cuisine = (event.target as HTMLSelectElement).value;
    if (cuisine) {
      this.restaurantService.updateFilters({ cuisine: [cuisine as any] });
    } else {
      this.restaurantService.clearFilters();
    }
  }

  onRatingFilter(event: Event): void {
    const rating = parseFloat((event.target as HTMLSelectElement).value);
    this.restaurantService.updateFilters({ rating });
  }
}
