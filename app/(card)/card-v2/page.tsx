import ProductCard, { Product } from "@/components/ProductCard";

const products: Product[] = [
  {
    image: "/product/a1.jpeg",
    background: "/product/a2.jpeg",
    name: "Blaze Runner",
    price: 275.0,
  },
  {
    image: "/product/b1.jpeg",
    background: "/product/b2.jpeg",
    name: "Volt Surge",
    price: 320.0,
  },
  {
    image: "/product/c1.jpeg",
    background: "/product/c2.jpeg",
    name: "Frost Glide",
    price: 245.0,
  },
  {
    image: "/product/d1.jpeg",
    background: "/product/d2.jpeg",
    name: "Terra Drift",
    price: 195.0,
  },
  {
    image: "/product/e1.jpeg",
    background: "/product/e2.jpeg",
    name: "Dune Trek",
    price: 310.0,
  },
];

export default function ProductPage() {
  return <ProductCard products={products} />;
}
