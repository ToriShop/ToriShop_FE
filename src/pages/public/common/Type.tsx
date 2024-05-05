export type ProductType = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  createDate: Date;
  updateDate: Date;
};

export type OrderType = {
  product: ProductType;
  quantity: number;
  totalPrice: number;
};

export type OrderItemType = {
  productId: number;
  quantity: number;
  price: number;
};
