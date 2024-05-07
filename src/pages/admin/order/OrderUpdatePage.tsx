import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { GetOrderType } from "./OrderManagementPage";

type GetOrderItemType = {
  productName: string;
  quantity: number;
  price: number;
};

type Props = { orderItem?: GetOrderItemType };

const OrderItem = ({ orderItem }: Props) => {
  if (!orderItem) return null;
  return (
    <tr className="border">
      <td className="border p-2">{orderItem.productName}</td>
      <td className="border p-2">{orderItem.quantity}</td>
      <td className="border p-2">{orderItem.price}</td>
    </tr>
  );
};

export const OrderUpdatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<GetOrderType | null>(location.state);
  const { id } = useParams();

  const [orderItems, setOrderItems] = useState<GetOrderItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleRadioChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const newValue = event.target.value;
    setOrder((prevOrder) => ({
      ...prevOrder!,
      [field]: newValue,
    }));
  };

  const updateOrder = async (order: GetOrderType) => {
    try {
      let token = localStorage.getItem("accessToken") || "NO_TOKEN";

      const res = await fetch("http://localhost:8080/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "AUTH-TOKEN": token,
        },
        body: JSON.stringify({
          id: order.id,
          recipientName: order.recipientName,
          recipientPhone: order.recipientPhone,
          recipientAddress: order.recipientAddress,
          deliveryStatus: order.deliveryStatus,
        }),
      });

      if (!res.ok) {
        console.error("HTTP error:", res.status, res.statusText);
        return;
      }

      alert("수정되었습니다.");
      navigate("/admin/order");
    } catch (err) {
      alert("수정 실패");
      console.error(err);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const token = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch(`http://localhost:8080/orderItem/order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });

        if (!res.ok) {
          setError("ERROR!");
        } else {
          const response = await res.json();
          const orderItem: GetOrderItemType[] = response.map((item: any) => ({
            productName: item.productId.name,
            quantity: item.quantity,
            price: item.price,
          }));
          setOrderItems(orderItem);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("ERROR!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">주문 수정</h1>

      <div className="mb-4">
        <label htmlFor="deliveryStatus" className="block font-semibold mb-1">
          배달 현황
        </label>
        <div>
          {[
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERING",
            "DELIVERED",
            "CANCELED",
            "RETURNED",
          ].map((status) => (
            <label key={status} className="mr-4">
              <input
                type="radio"
                id={`deliveryStatus-${status}`}
                name="deliveryStatus"
                value={status}
                checked={order?.deliveryStatus === status}
                onChange={(e) => handleRadioChange(e, "deliveryStatus")}
                className="mr-2"
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      <div className="mb-4">
        <label htmlFor="orderNumber" className="block font-semibold mb-1">
          주문 번호: {order?.orderNumber}
        </label>
      </div>

      <table className="border w-full mb-4">
        <thead>
          <tr className="bg-gray-200 border">
            <th className="border p-2">상품명</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">가격</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((orderItem) => (
            <OrderItem key={orderItem.productName} orderItem={orderItem} />
          ))}
        </tbody>
      </table>

      <button
        className="border p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => updateOrder(order!)}
      >
        수정하기
      </button>
    </div>
  );
};
