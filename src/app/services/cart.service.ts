import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { Cart, CartItem, SelectedCustomization } from '../shared/models/order.model';
import { MenuItem } from '../shared/models/restaurant.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiService = inject(ApiService);

  private readonly cartSignal = signal<Cart>(this.getInitialCart());

  readonly cart = this.cartSignal.asReadonly();
  readonly itemCount = computed(() =>
    this.cartSignal().items.reduce((total, item) => total + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.cartSignal().items.length === 0);
  readonly subtotal = computed(() => this.cartSignal().subtotal);
  readonly total = computed(() => this.cartSignal().total);

  private readonly TAX_RATE = 0.08; // 8% tax

  private getInitialCart(): Cart {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return this.createEmptyCart();
      }
    }
    return this.createEmptyCart();
  }

  private createEmptyCart(): Cart {
    return {
      restaurantId: null,
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0
    };
  }

  addItem(menuItem: MenuItem, restaurantId: string, quantity: number = 1,
          customizations?: SelectedCustomization[], specialInstructions?: string): void {

    // Check if adding from different restaurant
    if (this.cartSignal().restaurantId && this.cartSignal().restaurantId !== restaurantId) {
      if (!confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return;
      }
      this.clearCart();
    }

    const existingItemIndex = this.cartSignal().items.findIndex(item =>
      item.menuItemId === menuItem.id &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // Update existing item quantity
      updatedItems = this.cartSignal().items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        id: this.generateCartItemId(),
        menuItemId: menuItem.id,
        restaurantId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        image: menuItem.image,
        customizations,
        specialInstructions
      };
      updatedItems = [...this.cartSignal().items, newItem];
    }

    this.updateCart({
      restaurantId,
      items: updatedItems
    });
  }

  removeItem(cartItemId: string): void {
    const updatedItems = this.cartSignal().items.filter(item => item.id !== cartItemId);

    const updatedCart: Partial<Cart> = {
      items: updatedItems
    };

    if (updatedItems.length === 0) {
      updatedCart.restaurantId = null;
    }

    this.updateCart(updatedCart);
  }

  updateItemQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    const updatedItems = this.cartSignal().items.map(item =>
      item.id === cartItemId ? { ...item, quantity } : item
    );

    this.updateCart({ items: updatedItems });
  }

  applyPromoCode(code: string): Observable<{ discount: number }> {
    return this.apiService.post<{ discount: number }>('promo/validate', {
      code,
      subtotal: this.cartSignal().subtotal
    }).pipe(
      tap(response => {
        this.updateCart({
          promoCode: code,
          discount: response.discount
        });
      })
    );
  }

  removePromoCode(): void {
    this.updateCart({
      promoCode: undefined,
      discount: undefined
    });
  }

  clearCart(): void {
    this.cartSignal.set(this.createEmptyCart());
    this.saveCart();
  }

  private updateCart(partial: Partial<Cart>): void {
    this.cartSignal.update(current => {
      const updated = { ...current, ...partial };

      // Recalculate totals
      updated.subtotal = updated.items.reduce(
        (total, item) => {
          const itemTotal = item.price * item.quantity;
          const customizationTotal = item.customizations?.reduce(
            (sum, c) => sum + c.price, 0
          ) || 0;
          return total + (itemTotal + customizationTotal) * item.quantity;
        }, 0
      );

      updated.tax = updated.subtotal * this.TAX_RATE;

      updated.total = updated.subtotal +
                     (updated.deliveryFee || 0) +
                     updated.tax -
                     (updated.discount || 0);

      return updated;
    });

    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSignal()));
  }

  private generateCartItemId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
