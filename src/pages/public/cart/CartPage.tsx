import {Cart, useSession} from "../../../contexts/session-context";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";

type Props = {
    cart: Cart;
};

export const CartPage = () => {
    const {session, removeItem, plusQuantity, minusQuantity} = useSession();
    const navigate = useNavigate();
    const [cartList, setCartList] = useState<Cart[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (!session.user) {
            // 로그인 페이지로 리다이렉트
            navigate("/customer/login");
        } else {
            setCartList(session.cart);
            const price = session.cart
                .filter(item => item.isInOrder)
                .reduce((accumulator, object) => {
                    return accumulator + object.price * object.quantity;
                }, 0);
            setTotalPrice(price);
        }
    }, [navigate, session]);

    const purchaseItems = () => {
        navigate('/customer/pay');
        return
    }

    return (
        <>
            <div className="bg-white rounded-lg p-5 m-5">
                <h1 className="text-2xl font-bold mb-5">장바구니</h1>
                <div className="flex justify-between mb-5">
                    <h2 className="text-xl font-semibold">상품 목록</h2>
                    <button className="bg-blue-500 text-white px-3 py-2 rounded"
                    onClick={purchaseItems}>구매하기</button>
                </div>
                <ul id="cart" className="space-y-5">
                    {cartList.map((cart) => (
                        <CartOne cart={cart} key={cart.productId}/>
                    ))}
                </ul>
                <h5 className="text-2xl font-bold mb-5">총 가격: {totalPrice}</h5>
            </div>
        </>
    );
};

export const CartOne = ({cart: cart}: Props) => {
    const {removeItem, plusQuantity, minusQuantity, isInOrder} = useSession();

    const increaseQuantity = (id: number) => {
        plusQuantity(id);
    };

    // 수량 감소 함수

    const decreaseQuantity = (id: number) => {
        minusQuantity(id);
    };

    const onChangeCheckedBox = (e: ChangeEvent<HTMLInputElement>, productId: number) => {
        console.log(e.target.checked);
        isInOrder(productId, e.target.checked);
    }

    return (
        <li id="item-1"
            key={cart.productId}
            className="bg-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm">
            <input type="checkbox"
                   className="cart-item"
                   checked={cart.isInOrder}
                   onChange={(e) => onChangeCheckedBox(e, cart.productId)}/>
            <div className="flex items-center">
                <img src="https://via.placeholder.com/50" alt="상품 이미지"
                     className="w-16 h-16 rounded-lg mr-4"/>
                <div>
                    <h3 className="text-lg font-semibold">{cart.productName}</h3>
                    <div className="text-sm text-gray-500">{cart.price}</div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex items-center mb-4">
                    <button
                        className="border border-gray-300 px-2 py-1 rounded"
                        onClick={() => decreaseQuantity(cart.productId)}
                    >
                        -
                    </button>
                    <span className="mx-2">{cart.quantity}</span>
                    <button
                        className="border border-gray-300 px-2 py-1 rounded"
                        onClick={() => increaseQuantity(cart.productId)}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="flex items-center">
                <span id="total-item-1" className="font-semibold">{cart.price * cart.quantity}</span>
            </div>
            <button className="ml-4 text-red-500" onClick={() => removeItem(cart.productId)}>X</button>
        </li>
    );
}
