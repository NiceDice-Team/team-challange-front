export interface DeliveryOptionResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  estimated_days: number;
}

export interface DeliveryOption {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}
