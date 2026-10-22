export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  featured?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}