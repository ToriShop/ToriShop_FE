import {useNavigate} from "react-router-dom";
import {useSession} from "../../../contexts/session-context";
import exp from "node:constants";

const Header = () => {
    const {session, signOut} = useSession();
    const navigate = useNavigate();

    const logout = () => {
        signOut();
        navigate("/login");
    };

    return (
        <>
            <nav className="bg-amber-600 border-b shadow-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-12">
                    <a className="text-white font-bold text-xl" href="/customer/product">
                        TORI MALL
                    </a>
                    <div className="hidden md:flex space-x-6">

                        {session?.user && (
                            <>
                                <button className="text-white hover:text-gray-300" onClick={logout}>
                                    로그아웃
                                </button>
                                <a className="text-white hover:text-gray-300" href="/admin/product">
                                    상품관리
                                </a>
                                <a className="text-white hover:text-gray-300" href="/admin/order">
                                    주문관리
                                </a>
                                <a className="text-white hover:text-gray-300" href="/admin/user">
                                    고객관리
                                </a>
                            </>
                        )}
                    </div>
                </div>

                <div className="md:hidden" id="mobile-menu">
                    <ul className="bg-amber-600 p-4 space-y-4">
                        {!session?.user && (
                            <>
                                <li>
                                    <a className="text-white hover:text-gray-300" href="/login">
                                        로그인
                                    </a>
                                </li>
                                <li>
                                    <a className="text-white hover:text-gray-300" href="/customer/product">
                                        상품목록
                                    </a>
                                </li>
                            </>
                        )}

                        {session?.user && (
                            <>
                                <li>
                                    <button className="text-white hover:text-gray-300" onClick={logout}>
                                        로그아웃
                                    </button>
                                </li>
                                <li>
                                    <a className="text-white hover:text-gray-300" href="/customer/cart">
                                        장바구니
                                    </a>
                                </li>
                                <li>
                                    <a className="text-white hover:text-gray-300" href="/customer/product">
                                        상품목록
                                    </a>
                                </li>
                                <li>
                                    <a className="text-white hover:text-gray-300" href="/customer/mypage">
                                        마이페이지
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Header;