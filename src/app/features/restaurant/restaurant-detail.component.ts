import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { Restaurant } from '../../shared/models/restaurant.model';
import { FoodCardComponent } from '../../shared/components/food-card/food-card.component';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FoodCardComponent],
  template: `
    <div class="restaurant-detail">
      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else if (restaurant()) {
        <div class="restaurant-header">
          <img [src]="restaurant()!.coverImage" [alt]="restaurant()!.name" class="cover-image">
          <div class="restaurant-info">
            <h1>{{ restaurant()!.name }}</h1>
            <p>{{ restaurant()!.description }}</p>
            <div class="restaurant-stats">
              <span>⭐ {{ restaurant()!.rating }}</span>
              <span>🕒 {{ restaurant()!.deliveryTime }}</span>
              <span>🚚 {{ restaurant()!.deliveryFee === 0 ? 'Free' : (restaurant()!.deliveryFee | currency) }}</span>
            </div>
          </div>
        </div>

        <div class="menu-section">
          <div class="container">
            @for (category of restaurant()!.menu; track category.id) {
              <div class="menu-category">
                <h2>{{ category.name }}</h2>
                <div class="items-grid">
                  @for (item of category.items; track item.id) {
                    <app-food-card
                      [item]="item"
                      [showAddButton]="true"
                      (addToCart)="onAddToCart($event)"
                    />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .restaurant-detail {
      min-height: 100vh;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      font-size: 18px;
    }

    .restaurant-header {
      position: relative;
      height: 300px;
      overflow: hidden;
    }

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .restaurant-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
      padding: 40px 20px 20px;
    }

    .restaurant-info h1 {
      margin: 0 0 8px;
      font-size: 32px;
    }

    .restaurant-info p {
      margin: 0 0 12px;
      opacity: 0.9;
    }

    .restaurant-stats {
      display: flex;
      gap: 24px;
      font-size: 14px;
    }

    .menu-section {
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .menu-category {
      margin-bottom: 60px;
    }

    .menu-category h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #333;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
  `]
})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);
  private cartService = inject(CartService);

  restaurant = this.restaurantService.selectedRestaurant;
  loading = this.restaurantService.loading;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.restaurantService.getRestaurantById(id).subscribe();
      }
    });
  }

  onAddToCart(item: any): void {
    if (this.restaurant()) {
      this.cartService.addItem(item, this.restaurant()!.id, 1);
      alert(`${item.name} added to cart!`);
    }
  }
}
