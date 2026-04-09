import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders">
      <div class="container">
        <h1>Order History</h1>

        <div class="orders-list">
          @for (order of mockOrders; track order.id) {
            <div class="order-card">
              <div class="order-header">
                <h3>{{ order.restaurantName }}</h3>
                <span class="order-status" [class]="'status-' + order.status">
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              <div class="order-details">
                <p><strong>Order ID:</strong> {{ order.id }}</p>
                <p><strong>Date:</strong> {{ order.createdAt | date:'short' }}</p>
                <p><strong>Total:</strong> {{ order.total | currency }}</p>
              </div>
              <div class="order-items">
                <p><strong>Items:</strong> {{ order.items.length }} item(s)</p>
              </div>
              <div class="order-actions">
                <button [routerLink]="['/orders/track', order.id]" class="btn-track">
                  Track Order
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders {
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 32px;
      color: #333;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid #667eea;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-header h3 {
      margin: 0;
      color: #333;
    }

    .order-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;

      &.status-delivered {
        background: #d4edda;
        color: #155724;
      }

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-preparing {
        background: #cce5ff;
        color: #004085;
      }

      &.status-out_for_delivery {
        background: #e2e3e5;
        color: #383d41;
      }
    }

    .order-details {
      margin-bottom: 12px;
    }

    .order-details p {
      margin: 6px 0;
      font-size: 14px;
      color: #666;
    }

    .order-items {
      margin-bottom: 16px;
    }

    .order-items p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .order-actions {
      display: flex;
      gap: 12px;
    }

    .btn-track {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        background: #5a67d8;
      }
    }
  `]
})
export class OrderHistoryComponent {
  mockOrders = [
    {
      id: 'order1',
      restaurantName: 'Pizza Paradise',
      status: 'delivered' as const,
      createdAt: new Date('2024-01-15'),
      total: 35.37,
      items: []
    },
    {
      id: 'order2',
      restaurantName: 'Sushi Master',
      status: 'preparing' as const,
      createdAt: new Date('2024-01-16'),
      total: 42.50,
      items: []
    }
  ];

  formatStatus(status: string): string {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
