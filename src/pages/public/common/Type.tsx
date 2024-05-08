//create&update용
export type ProductType = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: File;
  createDate: Date;
  updateDate: Date;
};

//get용
export type GetProductType = {
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

//상품목록&장바구니 정보를 결제 화면으로 넘길 때 필요한 타입
export type OrderType = {
  product: GetProductType;
  quantity: number;
  totalPrice: number;
};

//create orderItem용
export type OrderItemType = {
  productId: number;
  quantity: number;
  price: number;
};
