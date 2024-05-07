import { useLocation, useNavigate } from "react-router-dom";
import { OrderItemType, OrderType } from "../common/Type";
import { useEffect, useState } from "react";
import { useSession } from "../../../contexts/session-context";

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const { session } = useSession();

  const makeOrder = async (orders: OrderType[]) => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const phoneInput = document.getElementById("phone") as HTMLInputElement;
    const addressInput = document.getElementById("address") as HTMLInputElement;
    const name: string = nameInput.value;
    const phone: string = phoneInput.value;
    const address: string = addressInput.value;

    const orderItems: OrderItemType[] = [];
    orders.forEach((order) => {
      const productId = order.product.id;
      const quantity = order.quantity;
      const price = order.totalPrice;
      const orderItem: OrderItemType = { productId, quantity, price };
      orderItems.push(orderItem);
    });

    let token;
    if (session.user) {
      token = session.user.token;
    } else {
      token = "NO_TOKEN";
    }

    try {
      const res = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "AUTH-TOKEN": token,
        },
        body: JSON.stringify({
          recipientName: name,
          recipientPhone: phone,
          recipientAddress: address,
          orderItems: orderItems,
        }),
      });
      if (!res.ok) {
        console.error("HTTP error:", res.status, res.statusText);
        return;
      }
      const result = await res.json();
      const orderId = result.id;
      navigate("/customer/order", { state: orderId });
    } catch (err) {
      console.log(err);
    }
  };

  const location = useLocation();
  const orders: OrderType[] = location.state;

  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    let sum: number = 0;
    orders.forEach((order) => {
      sum += order.totalPrice;
    });
    setOrderTotal(sum);
  }, [orders]);

  return (
    <>
      <div>
        {orders?.map((order) => (
          <div key={order.product.id}>
            <div
              className="order-item"
              style={{
                width: "100px",
                borderColor: "grey",
                borderWidth: "1px",
              }}
            >
              <div>{order.product.name}</div>
              <div>{order.quantity}</div>
              <div>{order.totalPrice}</div>
            </div>
          </div>
        ))}
        <span>총 결제액: {orderTotal}</span>
      </div>

      <div>
        <label>이름</label>
        <input type="text" id="name" required />
        <br />
        <label>핸드폰번호</label>
        <input type="text" id="phone" required />
        <br />
        <label>주소</label>
        <input type="text" id="address" required />
        <br />
      </div>

      <div>
        <button
          type="submit"
          style={{
            borderColor: "grey",
            borderWidth: "1px",
            margin: "10px",
          }}
          onClick={() => makeOrder(orders)}
        >
          구매하기
        </button>
      </div>
    </>
  );
};
