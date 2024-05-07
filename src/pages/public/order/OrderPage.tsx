import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSession } from "../../../contexts/session-context";

export const OrderPage = () => {
  const location = useLocation();
  const orderId = location.state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("null");

  const { session } = useSession();

  useEffect(() => {
    let token;
    if (session.user) {
      token = session.user.token;
    } else {
      token = "NO_TOKEN";
    }
    (async function () {
      try {
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
  }, [orderId, session.user]);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}

      <h1>주문번호: {orderNumber}</h1>
    </>
  );
};
