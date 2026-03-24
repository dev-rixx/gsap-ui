export interface Product {
  image: string;
  background: string;
  name: string;
  price: number;
}

export interface ProductCardProps {
  products: Product[];
}
