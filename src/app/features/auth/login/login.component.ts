import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign In</h2>
        <p class="subtitle">Welcome back to FoodDelivery</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="your@email.com"
              class="form-input"
            >
            @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
              <span class="error">Email is required</span>
            }
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <span class="error">Invalid email format</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-input"
            >
            @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
              <span class="error">Password is required</span>
            }
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="submit-btn"
          >
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="demo-note">Demo Credentials: demo@example.com / demo123</p>
        <p class="auth-link">
          Don't have an account? <a routerLink="/auth/register">Sign Up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 28px;
      color: #333;
    }

    .subtitle {
      margin: 0 0 32px;
      color: #666;
      font-size: 14px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .form-input {
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    .error {
      color: #ff6b6b;
      font-size: 12px;
    }

    .error-message {
      background: #ffe0e0;
      color: #d73a49;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      border-left: 4px solid #ff6b6b;
    }

    .submit-btn {
      padding: 12px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: #5a67d8;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    .demo-note {
      background: #e7f3ff;
      border: 1px solid #91d5ff;
      color: #0050b3;
      padding: 10px;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      margin-bottom: 20px;
    }
    .auth-link {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #666;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.value as any).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err.message || 'Login failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
