export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  cuisine: CuisineType[];
  rating: number;
  totalReviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours: OpeningHours;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  menu: MenuCategory[];
}

export type CuisineType =
  | 'Italian'
  | 'Chinese'
  | 'Indian'
  | 'Mexican'
  | 'Japanese'
  | 'Thai'
  | 'American'
  | 'Mediterranean';

export interface OpeningHours {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
}

export interface TimeRange {
  open: string;
  close: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  customizationOptions?: CustomizationOption[];
  nutritionalInfo?: NutritionalInfo;
}

export interface CustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  choices: CustomizationChoice[];
}

export interface CustomizationChoice {
  id: string;
  name: string;
  price: number;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
