export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  createdAt: string;
  status: string;
}