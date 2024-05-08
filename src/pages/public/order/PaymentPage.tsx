import { Cart, useSession } from "../../../contexts/session-context";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

type Props = {
  cart: Cart;
};

type CreateOrderItem = {
  productId: number;
  quantity: number;
  price: number;
};

type CreateOrder = {
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  orderItems: CreateOrderItem[];
};

const PaymentPage = () => {
    const {session, clearCart} = useSession();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

  const handleChangeName = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleChangePhone = (event: FormEvent<HTMLInputElement>) => {
    setPhone(event.currentTarget.value);
  };

  const handleChangeAddress = (event: FormEvent<HTMLInputElement>) => {
    setAddress(event.currentTarget.value);
  };

  const getCheckedProduct = () => {
    return session.cart.filter((item) => item.isInOrder);
  };

  const getTotalPrice = () => {
    return session.cart
      .filter((item) => item.isInOrder)
      .reduce((acc, object) => {
        return acc + object.price * object.quantity;
      }, 0);
  };

  const productList = getCheckedProduct();
  const totalPrice = getTotalPrice();
  const purchaseItems = () => {
    if (session.user) {
      const token = session.user.token;

      let orderItemsList: CreateOrderItem[] = [];
      productList.map((item) => {
        orderItemsList.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        } as CreateOrderItem);
      });

      const order: CreateOrder = {
        recipientName: name,
        recipientPhone: phone,
        recipientAddress: address,
        orderItems: orderItemsList,
      };

      try {
        (async function () {
          const response = await fetch("http://localhost:8080/order", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "AUTH-TOKEN": token,
            },
            body: JSON.stringify(order),
          });

                    if (response.ok) {
                        const json = await response.json();
                        const id = json["id"];
                        alert("상품 구매 완료했습니다.");
                        clearCart();
                        navigate(`/customer/order/${id}`);
                    } else {
                        const json = await response.json();
                        alert(json.message)
                    }
                })();
            } catch (err) {

            }
        } else {
            navigate('/login');
        }
    }
  };

  return (
    <>
      {
        <div className="bg-white rounded-lg p-5 m-5">
          <h1 className="text-2xl font-bold mb-5">결제 화면</h1>
          <div>
            <div className={"inline-flex w-24 font-semibold text-lg"}>name</div>
            <input
              type="text"
              value={name}
              onChange={handleChangeName}
              className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
            />
          </div>
          <div>
            <div className={"inline-flex w-24 font-semibold text-lg"}>
              phone
            </div>
            <input
              type="text"
              value={phone}
              onChange={handleChangePhone}
              className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
            />
          </div>
          <div>
            <div className={"inline-flex w-24 font-semibold text-lg"}>
              address
            </div>
            <input
              type="text"
              value={address}
              onChange={handleChangeAddress}
              className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}
            />
          </div>
          <div className="flex justify-between m-5 ">
            <h2 className="text-xl font-semibold">상품 목록</h2>
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={purchaseItems}
            >
              결제하기
            </button>
          </div>
          <ul id="cart" className="p-5 space-y-5">
            {productList.map((cart) => (
              <ProductOne cart={cart} key={cart.productId} />
            ))}
          </ul>
          <h5 className="text-2xl font-bold mb-5">총 가격: {totalPrice}</h5>
        </div>
      }
    </>
  );
};

export const ProductOne = ({ cart: cart }: Props) => {
  return (
    <li
      id="item-1"
      key={cart.productId}
      className="bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/50"
          alt="상품 이미지"
          className="w-16 h-16 rounded-lg mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{cart.productName}</h3>
          <div className="text-sm text-gray-500">{cart.price}</div>
        </div>
      </div>
      <div className="flex items-center">
        <span id="total-item-1" className="font-semibold">
          {cart.price * cart.quantity}
        </span>
      </div>
    </li>
  );
};

export default PaymentPage;
