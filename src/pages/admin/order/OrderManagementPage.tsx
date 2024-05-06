import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
type Props = {
  order?: GetOrderType;
};

const Order = ({ order }: Props) => {
  const navigate = useNavigate();

  if (!order) return null;

  const goToUpdate = (order: GetOrderType) => {
    navigate(`/admin/order/${order.id}`, { state: order });
  };

  return (
    <>
      <div
        onClick={() => goToUpdate(order)}
        className="order-item"
        style={{
          cursor: "pointer",
          borderColor: "grey",
          borderWidth: "1px",
          margin: "10px",
        }}
      >
        <div>{order.orderNumber}</div>
        <div>{order.totalPrice}</div>
        <div>{order.recipientName}</div>
        <div>{order.recipientPhone}</div>
        <div>{order.recipientAddress}</div>
        <div>{order.deliveryStatus}</div>
        {/* <div>{order.orderDate}</div> */}
      </div>
    </>
  );
};

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<GetOrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const response = await res.json();
        const order: GetOrderType[] = response.map((item: any) => ({
          id: response.id,
          customerId: item.customerId,
          orderNumber: item.orderNumber,
          totalPrice: item.totalPrice,
          recipientName: item.recipientName,
          recipientPhone: item.recipientPhone,
          recipientAddress: item.recipientAddress,
          deliveryStatus: item.deliveryStatus,
          orderDate: item.orderDate,
        }));
        setOrders(order);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <h4>주문 관리</h4>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      {orders?.map((order) => (
        <div key={order.id}>
          <Order order={order} />
        </div>
      ))}
    </>
  );
};
