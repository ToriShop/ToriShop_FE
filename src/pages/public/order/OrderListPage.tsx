import {useSession} from "../../../contexts/session-context";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

enum DeliveryStatus {
    PENDING = "PENDING", // 주문이 접수되고 처리를 기다리는 상태
    PROCESSING = "PROCESSING", // 주문이 확인되고 배송 준비 중인 상태
    SHIPPED = "SHIPPED", // 주문이 배송업체에 인계된 상태
    DELIVERING = "DELIVERING", // 배송이 진행 중인 상태
    DELIVERED = "DELIVERED", // 주문이 수령인에게 배송 완료된 상태
    CANCELED = "CANCELED", // 주문이 취소된 상태
    RETURNED = "RETURNED", // 주문이 반송된 상태
}

type Order = {
    id: number;
    customerId: number;
    orderNumber: String;
    totalPrice: number;
    recipientName: String;
    recipientPhone: String;
    recipientAddress: String;
    deliveryStatus: DeliveryStatus;
    orderDate: string;
};
const OrderListPage = () => {
    const {session} = useSession();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState<Order[]>([]);

    useEffect(() => {
        if (session.user) {
            let {token} = session.user;

            (async function () {
                try {
                    console.log(token);
                    const response = await fetch(`http://localhost:8080/order/customer`, {
                        method: "get",
                        headers: {
                            "Content-Type": "application/json",
                            "AUTH-TOKEN": token,
                        },
                    });

                    if (response.ok) {
                        const json = await response.json();
                        setOrderList(json as Order[]);
                        console.log(orderList);
                    } else {
                        alert("주문 조회에 실패했습니다.");
                    }
                } catch (err) {
                    alert("주문 조회에 실패했습니다.");
                }
            })();
        } else {
            // 로그인 페이지로 리다이렉트
            navigate("/customer/login");
        }
    }, [navigate, orderList, session.user]);


    return (
        <>
            <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderList.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white shadow-md border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                        onClick={() => navigate(`/customer/order/${order.id}`, {
                            state: {
                                orderNumber: order.orderNumber
                            }
                        })}
                    >
                        <h3 className="text-lg font-semibold mb-2">Order ID: {order.id}</h3>
                        <div className="mb-2">
                            <strong>Total Price:</strong> {order.totalPrice.toLocaleString()} KRW
                        </div>
                        <div className="mb-2">
                            <strong>Recipient Name:</strong> {order.recipientName}
                        </div>
                        <div className="mb-2">
                            <strong>Phone Number:</strong> {order.recipientPhone}
                        </div>
                        <div className="mb-2">
                            <strong>Address:</strong> {order.recipientAddress}
                        </div>
                        <div
                            className={`mb-2 ${order.deliveryStatus === "SHIPPED" ? "text-green-600" : "text-red-600"}`}>
                            <strong>Delivery Status:</strong> {order.deliveryStatus}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


export default OrderListPage;
