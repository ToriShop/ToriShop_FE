import exp from "node:constants";
import {useSession} from "../../../contexts/session-context";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

enum DeliveryStatus {
    PENDING="PENDING",    // 주문이 접수되고 처리를 기다리는 상태
    PROCESSING="PROCESSING", // 주문이 확인되고 배송 준비 중인 상태
    SHIPPED="SHIPPED",    // 주문이 배송업체에 인계된 상태
    DELIVERING="DELIVERING", // 배송이 진행 중인 상태
    DELIVERED="DELIVERED",  // 주문이 수령인에게 배송 완료된 상태
    CANCELED="CANCELED",   // 주문이 취소된 상태
    RETURNED="RETURNED"    // 주문이 반송된 상태
}

type Order = {
    id: number,
    customerId: number,
    orderNumber: String,
    totalPrice: number,
    recipientName: String,
    recipientPhone: String,
    recipientAddress: String,
    deliveryStatus: DeliveryStatus,
    orderDate: string
}
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
                    const response = await fetch(
                        `http://localhost:8080/order/customer`, {
                            method: "get",
                            headers: {
                                "Content-Type": "application/json",
                                "AUTH-TOKEN": token
                            }
                        })

                    if (response.ok) {
                        const json = await response.json();
                        setOrderList(json as Order[]);
                        console.log(orderList)
                    } else {
                        alert("주문 조회에 실패했습니다.")
                    }
                } catch (err) {
                    alert("주문 조회에 실패했습니다.")
                }
            })();
        } else {
            // 로그인 페이지로 리다이렉트
            navigate('/customer/login');
        }
    },[]);

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300">Order ID</th>
                            <th className="py-2 px-4 border-b border-gray-300">Total Price</th>
                            <th className="py-2 px-4 border-b border-gray-300">Recipient Name</th>
                            <th className="py-2 px-4 border-b border-gray-300">Phone Number</th>
                            <th className="py-2 px-4 border-b border-gray-300">Address</th>
                            <th className="py-2 px-4 border-b border-gray-300">Delivery Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderList.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b border-gray-300">{order.orderNumber}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{order.totalPrice.toLocaleString()} KRW</td>
                                <td className="py-2 px-4 border-b border-gray-300">{order.recipientName}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{order.recipientPhone}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{order.recipientAddress}</td>
                                <td className={`py-2 px-4 border-b border-gray-300 ${
                                    order.deliveryStatus === "SHIPPED" ? "text-green-600" : "text-red-600"
                                }`}>{order.deliveryStatus}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default OrderListPage;