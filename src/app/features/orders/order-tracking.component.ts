import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking">
      <div class="container">
        <h1>Track Your Order</h1>

        <div class="tracking-card">
          <h2>Order {{ orderId }}</h2>

          <div class="tracking-timeline">
            @for (update of trackingUpdates; track update.status) {
              <div class="timeline-item" [class.completed]="isCompleted(update.status)">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h3>{{ formatStatus(update.status) }}</h3>
                  <p>{{ update.timestamp | date:'short' }}</p>
                </div>
              </div>
            }
          </div>

          <div class="order-info">
            <h3>Estimated Delivery Time</h3>
            <p class="delivery-time">{{ estimatedDelivery | date:'short' }}</p>

            <h3 style="margin-top: 24px;">Driver Information</h3>
            <div class="driver-info">
              <p><strong>Name:</strong> John Smith</p>
              <p><strong>Vehicle:</strong> Honda Civic - ABC 123</p>
              <p><strong>Rating:</strong> ⭐ 4.8 (250 deliveries)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking {
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 32px;
      color: #333;
    }

    .tracking-card {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .tracking-card h2 {
      margin: 0 0 32px;
      color: #333;
    }

    .tracking-timeline {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #f0f0f0;
    }

    .timeline-item {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;

      &.completed {
        .timeline-dot {
          background: #22c55e;
          border-color: #22c55e;
        }

        .timeline-content h3 {
          color: #22c55e;
        }
      }
    }

    .timeline-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid #ddd;
      background: white;
      flex-shrink: 0;
      transition: all 0.3s;
    }

    .timeline-content h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }

    .timeline-content p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #999;
    }

    .order-info h3 {
      font-size: 16px;
      margin-bottom: 12px;
      color: #333;
    }

    .delivery-time {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
      margin: 0;
    }

    .driver-info {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 6px;
    }

    .driver-info p {
      margin: 8px 0;
      font-size: 14px;
      color: #666;
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);

  orderId = '';
  estimatedDelivery = new Date(Date.now() + 30 * 60000);

  trackingUpdates = [
    {
      status: 'confirmed',
      timestamp: new Date(Date.now() - 10 * 60000)
    },
    {
      status: 'preparing',
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      status: 'ready',
      timestamp: new Date()
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id') || '';
    });
  }

  formatStatus(status: string): string {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  isCompleted(status: string): boolean {
    const completedStatuses = ['confirmed', 'preparing', 'ready'];
    return completedStatuses.includes(status);
  }
}
