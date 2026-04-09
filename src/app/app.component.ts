import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app">
      <nav class="navbar">
        <div class="navbar__container">
          <a routerLink="/home" class="navbar__logo">
            🍔 FoodDelivery
          </a>

          <div class="navbar__menu">
            <a routerLink="/home"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: true}"
               class="navbar__link">
              Home
            </a>

            @if (authService.isAuthenticated()) {
              <a routerLink="/orders"
                 routerLinkActive="active"
                 class="navbar__link">
                Orders
              </a>
            }
          </div>

          <div class="navbar__actions">
            @if (!authService.isAuthenticated()) {
              <a routerLink="/auth/login" class="navbar__btn navbar__btn--outline">
                Sign In
              </a>
              <a routerLink="/auth/register" class="navbar__btn navbar__btn--primary">
                Sign Up
              </a>
            } @else {
              <a routerLink="/cart" class="navbar__cart">
                🛒 Cart
                @if (cartService.itemCount() > 0) {
                  <span class="navbar__cart-count">{{ cartService.itemCount() }}</span>
                }
              </a>
              <a routerLink="/profile" class="navbar__profile">
                👤 Profile
              </a>
              <button (click)="logout()" class="navbar__btn navbar__btn--outline">
                Sign Out
              </button>
            }
          </div>
        </div>
      </nav>

      <main class="main">
        <router-outlet />
      </main>

      <footer class="footer">
        <div class="footer__container">
          <p>&copy; 2024 FoodDelivery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar__logo {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
      text-decoration: none;
    }

    .navbar__menu {
      display: flex;
      gap: 32px;
    }

    .navbar__link {
      color: #666;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;

      &:hover, &.active {
        color: #667eea;
      }
    }

    .navbar__actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .navbar__btn {
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;

      &--primary {
        background: #667eea;
        color: white;

        &:hover {
          background: #5a67d8;
        }
      }

      &--outline {
        background: transparent;
        color: #667eea;
        border: 1px solid #667eea;

        &:hover {
          background: #667eea;
          color: white;
        }
      }
    }

    .navbar__cart {
      position: relative;
      text-decoration: none;
      color: #333;
      font-size: 24px;
    }

    .navbar__cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff6b6b;
      color: white;
      font-size: 12px;
      font-weight: 600;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .navbar__profile {
      text-decoration: none;
      color: #333;
      font-size: 24px;
    }

    .main {
      flex: 1;
    }

    .footer {
      background: #333;
      color: white;
      padding: 40px 20px;
      margin-top: auto;
    }

    .footer__container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
  `]
})
export class AppComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);

  logout(): void {
    this.authService.logout();
  }
}
