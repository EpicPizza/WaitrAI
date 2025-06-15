export interface OrderItem {
  name: string;
  quantity: number;
  modifications?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  timestamp: string;
  items: OrderItem[];
  preferences: string[];
  status: 'new' | 'preparing' | 'ready' | 'delivered';
} 