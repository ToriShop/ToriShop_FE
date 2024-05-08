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
        const json = await res.json();
        alert(json.message)
      }
      const result = await res.json();
      const orderId = result.id;
      navigate(`/customer/order/${orderId}`, {
        state: {
          orderNumber: result.orderNumber
        }
      });
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
      <h1 className="text-2xl font-bold mb-5">결제 화면</h1>
      <div>
        <div className={"inline-flex w-24 font-semibold text-lg"}>name</div>
        <input
          type="text"
          id="name"
          className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
        />
      </div>
      <div>
        <div className={"inline-flex w-24 font-semibold text-lg"}>phone</div>
        <input
          type="text"
          id="phone"
          className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
        />
      </div>
      <div>
        <div className={"inline-flex w-24 font-semibold text-lg"}>address</div>
        <input
          type="text"
          id="address"
          className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
        />
      </div>
      <div className="flex justify-between m-5 ">
        <h2 className="text-xl font-semibold">상품 목록</h2>
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded"
          onClick={() => makeOrder(orders)}
        >
          결제하기
        </button>
      </div>

      <ul id="order" className="p-5 space-y-5">
        {orders?.map((order) => (
          <li
            key={order.product.id}
            className="bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="상품 이미지"
                className="w-16 h-16 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{order.product.name}</h3>
                <div className="text-sm text-gray-500">
                  {order.totalPrice / order.quantity}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span id="total-item-1" className="font-semibold">
                {order.totalPrice}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <h5 className="text-2xl font-bold mb-5">총 가격: {orderTotal}</h5>
    </>
  );
};
