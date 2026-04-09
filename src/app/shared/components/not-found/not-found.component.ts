import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <div class="content">
        <div class="icon">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <a routerLink="/home" class="btn-home">Go Back Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
    }

    .content {
      text-align: center;
    }

    .icon {
      font-size: 120px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    h1 {
      font-size: 48px;
      margin: 0 0 8px;
      color: #333;
    }

    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 32px;
    }

    .btn-home {
      display: inline-block;
      padding: 12px 32px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s;

      &:hover {
        background: #5a67d8;
      }
    }
  `]
})
export class NotFoundComponent {}
