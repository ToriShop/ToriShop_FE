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
    <tr
      onClick={() => goToUpdate(order)}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="border px-4 py-2">{order.orderNumber}</td>
      <td className="border px-4 py-2">{order.totalPrice}</td>
      <td className="border px-4 py-2">{order.recipientName}</td>
      <td className="border px-4 py-2">{order.recipientPhone}</td>
      <td className="border px-4 py-2">{order.recipientAddress}</td>
      <td className="border px-4 py-2">{order.deliveryStatus}</td>
      <td className="border px-4 py-2">
        {new Date(order.orderDate).toLocaleDateString()}
      </td>
    </tr>
  );
};

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<GetOrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      try {
        let token = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch("http://localhost:8080/order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });

        if (!res.ok) {
          setError("ERROR!!!");
        } else {
          const response = await res.json();
          const order: GetOrderType[] = response.map((item: any) => ({
            id: item.id,
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
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-bold mb-4">주문 관리</h4>
      {loading && <h1 className="text-xl">Loading...</h1>}
      {error && <h1 className="text-xl text-red-600">{error}</h1>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order Number</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Recipient Name</th>
            <th className="border px-4 py-2">Recipient Phone</th>
            <th className="border px-4 py-2">Recipient Address</th>
            <th className="border px-4 py-2">Delivery Status</th>
            <th className="border px-4 py-2">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
