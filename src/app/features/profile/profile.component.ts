import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile">
      <div class="container">
        <h1>My Profile</h1>

        @if (authService.user()) {
          <div class="profile-layout">
            <div class="profile-card">
              <h2>Personal Information</h2>
              <div class="info-group">
                <label>Name</label>
                <p>{{ authService.user()!.firstName }} {{ authService.user()!.lastName }}</p>
              </div>
              <div class="info-group">
                <label>Email</label>
                <p>{{ authService.user()!.email }}</p>
              </div>
              <div class="info-group">
                <label>Phone</label>
                <p>{{ authService.user()!.phone }}</p>
              </div>
              <button class="btn-edit" (click)="toggleEditMode()">
                {{ editMode() ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>

            <div class="addresses-card">
              <h2>Saved Addresses</h2>
              @if (authService.user()!.addresses.length === 0) {
                <p class="empty-message">No saved addresses yet</p>
              } @else {
                <div class="addresses-list">
                  @for (address of authService.user()!.addresses; track address.id) {
                    <div class="address-item">
                      <div class="address-type">{{ address.type | titlecase }}</div>
                      <p>{{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                      @if (address.isDefault) {
                        <span class="default-badge">Default</span>
                      }
                    </div>
                  }
                </div>
              }
              <button class="btn-add">+ Add New Address</button>
            </div>

            <div class="preferences-card">
              <h2>Preferences</h2>
              <div class="preference-group">
                <label>
                  <input type="checkbox" [checked]="true">
                  Receive promotional emails
                </label>
              </div>
              <div class="preference-group">
                <label>
                  <input type="checkbox" [checked]="true">
                  Receive order updates
                </label>
              </div>
              <button class="btn-logout" (click)="logout()">Sign Out</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile {
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 32px;
      color: #333;
    }

    .profile-layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .profile-card,
    .addresses-card,
    .preferences-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    h2 {
      margin: 0 0 20px;
      font-size: 18px;
      color: #333;
    }

    .info-group {
      margin-bottom: 16px;
    }

    .info-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #999;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .info-group p {
      margin: 0;
      font-size: 16px;
      color: #333;
    }

    .btn-edit,
    .btn-add,
    .btn-logout {
      width: 100%;
      padding: 12px 16px;
      margin-top: 16px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit {
      background: #667eea;
      color: white;

      &:hover {
        background: #5a67d8;
      }
    }

    .btn-add {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;

      &:hover {
        background: #667eea;
        color: white;
      }
    }

    .btn-logout {
      background: #ff6b6b;
      color: white;

      &:hover {
        background: #ff5252;
      }
    }

    .addresses-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .address-item {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      position: relative;
    }

    .address-type {
      font-weight: 600;
      font-size: 12px;
      color: #667eea;
      margin-bottom: 4px;
    }

    .address-item p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .default-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 2px 8px;
      background: #667eea;
      color: white;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
    }

    .empty-message {
      text-align: center;
      color: #999;
      padding: 20px 0;
    }

    .preference-group {
      margin-bottom: 12px;
    }

    .preference-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
    }

    .preference-group input[type="checkbox"] {
      cursor: pointer;
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  editMode = signal(false);

  toggleEditMode(): void {
    this.editMode.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
