import {useEffect, useState} from "react";
import {OrderType, GetProductType} from "../../public/common/Type";
import {useNavigate, useParams} from "react-router-dom";
import {Cart, useSession} from "../../../contexts/session-context";

export const ProductDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {session, saveItem} = useSession();
  
    const goToCart = ({product, quantity, totalPrice}: OrderType) => {
      const order: OrderType = {product, quantity, totalPrice};

      if (session.user) {
          let {token} = session.user;
          (async function () {
              try {
                  const response = await fetch(
                      `http://localhost:8080/cart`, {
                          method: "post",
                          headers: {
                              "Content-Type": "application/json",
                              "AUTH-TOKEN": token
                          },
                          body: JSON.stringify({
                              "productId": id,
                              "isInOrder": false,
                              "quantity": quantity
                          })
                      }
                  )

                  if (response.ok) {
                      saveItem({
                          productId: product.id,
                          productName: product.name,
                          price: product.price,
                          isInOrder: true,
                          quantity: quantity
                      } as Cart);
                      navigate("/customer/cart", {state: order});
                  } else {
                      alert("장바구니 담기 실패했습니다.")
                      return;
                  }

              } catch (err) {
                  alert("장바구니 담기 실패했습니다.")
                  return;
              }
          })();
      } else {
          navigate("/login");
      }

    }

    const goToCheckout = ({product, quantity, totalPrice}: OrderType) => {
        const order: OrderType = {product, quantity, totalPrice};
        const orders: OrderType[] = [order];
        navigate("/customer/checkout", {state: orders});
    };

    const [product, setProduct] = useState<GetProductType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    // 수량 증가 함수
    const increaseQuantity = (price: number) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + 1;
            setTotalPrice(newQuantity * price);
            return newQuantity;
        });
    };

    // 수량 감소 함수
    const decreaseQuantity = (price: number) => {
        setQuantity((prevQuantity) => {
            if (prevQuantity > 1) {
                const newQuantity = prevQuantity - 1;
                setTotalPrice(newQuantity * price);
                return newQuantity;
            }
            return prevQuantity;
        });
    };

    useEffect(() => {
        let token;
        if (session.user) {
            token = session.user.token;
        } else {
            token = "NO_TOKEN";
        }
        (async function () {
            try {
                const res = await fetch(`http://localhost:8080/product/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "AUTH-TOKEN": token,
                    },
                });

                if (!res.ok) {
                    setError("ERROR!!!");
                } else {
                    const product = await res.json();
                    setProduct(product);
                    setTotalPrice(product.price);
                }
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError("ERROR!!");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id, session.user]);

    return (
        <div className="container mx-auto">
            <h4 className="text-lg font-bold mb-4">PRODUCT LIST</h4>
            {loading && <h1 className="text-lg">Loading...</h1>}
            {error && <h1 className="text-lg">{error}</h1>}

            {product && (
                <div className="border border-gray-300 rounded p-4">
                    <div className="mb-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-52 h-52 object-cover rounded mb-4"
                        />
                        <div className="text-xl font-semibold mb-2">{product.name}</div>
                        <div className="text-lg font-bold">{product.price}원</div>
                    </div>

                    <div className="flex items-center mb-4">
                        <button
                            className="border border-gray-300 px-2 py-1 rounded"
                            onClick={() => decreaseQuantity(product.price)}
                        >
                            -
                        </button>
                        <span className="mx-2">{quantity}</span>
                        <button
                            className="border border-gray-300 px-2 py-1 rounded"
                            onClick={() => increaseQuantity(product.price)}
                        >
                            +
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-lg">결제 금액: {totalPrice}원</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            className="border border-gray-300 px-4 py-2 rounded"
                            onClick={() => goToCart({product, quantity, totalPrice})}
                        >
                            장바구니
                        </button>
                        <button
                            className="border border-gray-300 px-4 py-2 rounded"
                            onClick={() => goToCheckout({product, quantity, totalPrice})}
                        >
                            구매하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
