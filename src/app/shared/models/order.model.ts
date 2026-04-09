export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: SelectedCustomization[];
  specialInstructions?: string;
}

export interface SelectedCustomization {
  optionId: string;
  optionName: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface Cart {
  restaurantId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  discount?: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDeliveryTime: Date;
  trackingUpdates: TrackingUpdate[];
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'cash' | 'wallet';
  details?: {
    last4?: string;
    brand?: string;
  };
}

export interface TrackingUpdate {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  location?: {
    lat: number;
    lng: number;
  };
}
