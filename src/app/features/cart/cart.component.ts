import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart">
      <div class="container">
        <h1>Shopping Cart</h1>

        @if (cartService.isEmpty()) {
          <div class="empty-cart">
            <div class="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <a routerLink="/home" class="btn-primary">Continue Shopping</a>
          </div>
        } @else {
          <div class="cart-layout">
            <div class="cart-items">
              @for (item of cartService.cart().items; track item.id) {
                <div class="cart-item">
                  <img [src]="item.image" [alt]="item.name" class="item-image">
                  <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <p class="item-price">{{ item.price | currency }}</p>
                  </div>
                  <div class="item-quantity">
                    <button (click)="decreaseQuantity(item.id)" class="qty-btn">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="increaseQuantity(item.id)" class="qty-btn">+</button>
                  </div>
                  <div class="item-total">{{ item.price * item.quantity | currency }}</div>
                  <button (click)="removeItem(item.id)" class="remove-btn">Remove</button>
                </div>
              }
            </div>

            <div class="cart-summary">
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ cartService.subtotal() | currency }}</span>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <span>{{ cart().tax | currency }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Fee</span>
                <span>{{ cart().deliveryFee | currency }}</span>
              </div>
              @if (cart().discount) {
                <div class="summary-row discount">
                  <span>Discount</span>
                  <span>-{{ cart().discount | currency }}</span>
                </div>
              }
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ cartService.total() | currency }}</span>
              </div>
              <button class="btn-checkout" routerLink="/checkout">Proceed to Checkout</button>
              <button class="btn-secondary" routerLink="/home">Continue Shopping</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart {
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 32px;
      color: #333;
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 16px;
    }

    .empty-cart p {
      font-size: 18px;
      color: #666;
      margin-bottom: 24px;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 32px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr 120px 100px 80px;
      gap: 16px;
      align-items: center;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .item-image {
      width: 80px;
      height: 80px;
      border-radius: 6px;
      object-fit: cover;
    }

    .item-details h3 {
      margin: 0 0 4px;
      font-size: 16px;
    }

    .item-price {
      margin: 0;
      color: #667eea;
      font-weight: 600;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        background: #667eea;
        color: white;
      }
    }

    .item-total {
      text-align: right;
      font-weight: 600;
      color: #333;
    }

    .remove-btn {
      padding: 8px 12px;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        background: #ff5252;
      }
    }

    .cart-summary {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .cart-summary h2 {
      margin: 0 0 16px;
      font-size: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;

      &.total {
        border: none;
        padding-top: 16px;
        font-size: 18px;
        font-weight: 700;
        color: #667eea;
      }

      &.discount {
        color: #22c55e;
      }
    }

    .btn-checkout {
      width: 100%;
      padding: 12px;
      margin-top: 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: #5a67d8;
      }
    }

    .btn-secondary {
      width: 100%;
      padding: 12px;
      margin-top: 8px;
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: #667eea;
        color: white;
      }
    }

    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 60px 1fr;
      }

      .item-quantity,
      .item-total,
      .remove-btn {
        grid-column: 2;
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  cart = this.cartService.cart;

  decreaseQuantity(itemId: string): void {
    const item = this.cartService.cart().items.find(i => i.id === itemId);
    if (item) {
      this.cartService.updateItemQuantity(itemId, item.quantity - 1);
    }
  }

  increaseQuantity(itemId: string): void {
    const item = this.cartService.cart().items.find(i => i.id === itemId);
    if (item) {
      this.cartService.updateItemQuantity(itemId, item.quantity + 1);
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }
}
