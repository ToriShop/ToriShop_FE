import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const OrderPage = () => {
  const location = useLocation();
  const orderId = location.state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("null");

  useEffect(() => {
    (async function () {
      try {
        let token: string = localStorage.getItem("accessToken") || "NO_TOKEN";

        const res = await fetch(`http://localhost:8080/order/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
        });
        if (!res.ok) setError("ERROR!!!");
        const order = await res.json();
        setOrderNumber(order.orderNumber);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setError("ERROR!!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      <h1>주문번호: {orderNumber}</h1>
    </>
  );
};
