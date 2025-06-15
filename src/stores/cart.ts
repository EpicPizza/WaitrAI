import { writable } from 'svelte/store';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
};

export const cart = writable<CartItem[]>([]); 