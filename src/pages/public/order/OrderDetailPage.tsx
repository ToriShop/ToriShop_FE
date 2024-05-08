import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSession} from "../../../contexts/session-context";
import {GetOrderItemType} from "../../public/common/Type";

const OrderDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const {session} = useSession();
    const location = useLocation();
    const [orderItemList, setOrderItemList] = useState<GetOrderItemType[]>([]);
    const {orderNumber} = location.state || [];

    useEffect(() => {
        if (session.user) {
            let {token} = session.user;
            (async function () {
                try {
                    const response = await fetch(
                        `http://localhost:8080/orderItem/order/${id}`, {
                            method: "get",
                            headers: {
                                "Content-Type": "application/json",
                                "AUTH-TOKEN": token
                            }
                        }
                    )

                    const json = await response.json();
                    setOrderItemList(json as GetOrderItemType[]);

                } catch (err) {
                    alert("주문 상세 조회에 실패했습니다.")
                }
            })();
        }
    }, [id]);

    return (
        <>
            {
                orderItemList.length === 0 ?
                    <div>주문 목록이 비었습니다.</div> :
                    <div className="container mx-auto p-6">
                        <h1 className="text-2xl font-bold mb-5">주문 상세 화면</h1>
                        <h5 className="text-xl font-bold mb-5">OrderNumber: {orderNumber}</h5>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-300">상품명</th>
                                    <th className="py-2 px-4 border-b border-gray-300">카테고리</th>
                                    <th className="py-2 px-4 border-b border-gray-300">총 가격</th>
                                    <th className="py-2 px-4 border-b border-gray-300">수량</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderItemList?.map((orderItem) => (
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-300">{orderItem.productId.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{orderItem.productId.category}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{orderItem.price.toLocaleString()} KRW</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{orderItem.quantity}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </>
    )
}

export default OrderDetailPage;