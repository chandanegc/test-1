import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/restaurant.model';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="food-card" [class.featured]="featured">
      <div class="food-card__image-container">
        <img [src]="item.image" [alt]="item.name" class="food-card__image" loading="lazy">
        <div class="food-card__badges">
          <span *ngIf="item.isVegetarian" class="badge badge--veg" title="Vegetarian">🌿</span>
          <span *ngIf="item.isVegan" class="badge badge--vegan" title="Vegan">🌱</span>
          <span *ngIf="item.isSpicy" class="badge badge--spicy" title="Spicy">🌶️</span>
        </div>
        <button *ngIf="showAddButton" class="food-card__add-btn" (click)="onAddToCart()">
          <span>+</span> Add
        </button>
      </div>

      <div class="food-card__content">
        <h3 class="food-card__title">{{ item.name }}</h3>
        <p class="food-card__description">{{ item.description }}</p>

        <div class="food-card__footer">
          <span class="food-card__price">{{ item.price | currency }}</span>

          <div *ngIf="item.nutritionalInfo" class="food-card__nutrition">
            <span class="nutrition__calories">{{ item.nutritionalInfo.calories }} cal</span>
          </div>
        </div>

        <div *ngIf="showQuantityControls && quantity > 0" class="food-card__quantity-controls">
          <button class="quantity-btn" (click)="updateQuantity(-1)" [disabled]="quantity <= 1">
            -
          </button>
          <span class="quantity">{{ quantity }}</span>
          <button class="quantity-btn" (click)="updateQuantity(1)">+</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .food-card {
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

      &.featured {
        border: 2px solid #ff6b6b;
      }
    }

    .food-card__image-container {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .food-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .food-card__badges {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 4px;
    }

    .badge {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .food-card__add-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.2s, transform 0.2s;

      .food-card:hover & {
        opacity: 1;
        transform: translateY(0);
      }

      &:hover {
        background: #ff5252;
      }
    }

    .food-card__content {
      padding: 16px;
    }

    .food-card__title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .food-card__description {
      margin: 0 0 12px;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .food-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .food-card__price {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }

    .food-card__nutrition {
      font-size: 12px;
      color: #999;
    }

    .food-card__quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .quantity-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #ddd;
      background: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #ff6b6b;
        color: white;
        border-color: #ff6b6b;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity {
      font-size: 16px;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
  `]
})
export class FoodCardComponent {
  @Input({ required: true }) item!: MenuItem;
  @Input() featured = false;
  @Input() showAddButton = true;
  @Input() showQuantityControls = false;
  @Input() quantity = 0;

  @Output() addToCart = new EventEmitter<MenuItem>();
  @Output() quantityChange = new EventEmitter<number>();

  onAddToCart(): void {
    this.addToCart.emit(this.item);
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    this.quantityChange.emit(newQuantity);
  }
}
