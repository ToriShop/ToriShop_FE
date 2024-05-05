import { useEffect, useState } from "react";
import { OrderType, ProductType } from "../../public/common/Type";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const goToCart = ({ product, quantity, totalPrice }: OrderType) => {
    const order: OrderType = { product, quantity, totalPrice };
    navigate("/customer/cart", { state: order });
  };
  const goToCheckout = ({ product, quantity, totalPrice }: OrderType) => {
    const order: OrderType = { product, quantity, totalPrice };
    const orders: OrderType[] = [order];
    navigate("/customer/checkout", { state: orders });
  };

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  // 수량 증가 함수
  const increaseQuantity = (price: Number) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1; // 수량 증가
      setTotalPrice(newQuantity * +price); // 결제 금액 업데이트
      return newQuantity;
    });
  };

  // 수량 감소 함수
  const decreaseQuantity = (price: Number) => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        const newQuantity = prevQuantity - 1; // 수량 감소
        setTotalPrice(newQuantity * +price); // 결제 금액 업데이트
        return newQuantity;
      }
      return prevQuantity; // 수량이 1보다 작아지지 않도록
    });
  };

  useEffect(() => {
    // const controller = new AbortController();
    // const option = controller;
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch(`http://localhost:8080/product/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const product = await res.json();
        setProduct(product);
        setTotalPrice(product.price);
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
      <h4>PRODUCT LIST</h4>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      {product && (
        <div>
          <div
            className="product-item"
            style={{
              width: "300px",
              borderColor: "grey",
              borderWidth: "1px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "200px", height: "200px" }}
            />
            <div>{product.name}</div>
            <div>{product.price}원</div>
          </div>

          <div>
            {/* 수량 조정 */}
            <div>
              <button
                onClick={() => {
                  decreaseQuantity(product.price);
                }}
              >
                -
              </button>
              <span> {quantity} </span>
              <button
                onClick={() => {
                  increaseQuantity(product.price);
                }}
              >
                +
              </button>
            </div>

            {/* 결제 금액 표시 */}
            <div>
              <p>결제 금액: {totalPrice}원</p>
            </div>
          </div>

          <div>
            <button
              style={{ margin: "10px" }}
              onClick={() => goToCart({ product, quantity, totalPrice })}
            >
              장바구니
            </button>
            <button
              style={{ margin: "10px" }}
              onClick={() => goToCheckout({ product, quantity, totalPrice })}
            >
              구매하기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
