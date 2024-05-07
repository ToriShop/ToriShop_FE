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
    <>
      <div
        className="orderItem-item"
        style={{
          borderColor: "grey",
          borderWidth: "1px",
          margin: "10px",
        }}
      >
        <div>{orderItem.productName}</div>
        <div>{orderItem.quantity}</div>
        <div>{orderItem.price}</div>
      </div>
    </>
  );
};

export const OrderUpdatePage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [order, setOrder] = useState(location.state);
  const { id } = useParams();

  const [orderItems, setOrderItems] = useState<GetOrderItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const newValue = event.target.value;
    setOrder((prevProduct: GetOrderType) => ({
      ...prevProduct,
      [field]: newValue,
    }));
  };

  const updateOrder = async (order: GetOrderType) => {
    try {
      let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

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
      alert("수정됐습니다.");
      navigate("/admin/order");
    } catch (err) {
      alert("수정 실패");
      console.log(err);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch(`http://localhost:8080/orderItem/order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const response = await res.json();
        const orderItem: GetOrderItemType[] = response.map((item: any) => ({
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.price,
        }));
        setOrderItems(orderItem);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      <h1>주문 수정</h1>

      <label>배달 현항</label>
      <input
        type="text"
        id="deliveryStatus"
        value={order.deliveryStatus}
        onChange={(e) => handleInputChange(e, "deliveryStatus")}
        required
      />
      <div>
        {loading && <h1>Loading...</h1>}
        {error && <h1>{error}</h1>}

        <h3>{order.orderNumber}</h3>
        {orderItems?.map((orderItem) => (
          <div key={orderItem.productName}>
            <OrderItem orderItem={orderItem} />
          </div>
        ))}
      </div>
      <button
        style={{
          borderColor: "grey",
          borderWidth: "1px",
        }}
        onClick={() => {
          updateOrder(order);
        }}
      >
        수정하기
      </button>
    </>
  );
};
