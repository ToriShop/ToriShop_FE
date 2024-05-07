//get용
export type GetOrderType = {
  id: number;
  customerId: number;
  orderNumber: string;
  totalPrice: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryStatus: string;
  orderDate: Date;
};

//get용
export type GetOrderItemType = {
  productName: string;
  quantity: number;
  price: number;
};

//get용
export type AdminType = {
  id: number;
  username: string;
  userRole: string;
  adminId: number;
  code: string;
};

//get용
export type CustomerType = {
  id: number;
  username: string;
  userRole: string;
  customerId: number;
  phoneNumber: string;
  email: string;
  address: string;
  totalOrderAmount: number;
  tier: string;
  joinDate: Date;
};
