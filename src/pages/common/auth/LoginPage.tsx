import {ChangeEvent, FormEvent, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Session, User, useSession} from "../../../contexts/session-context";

const Login = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const navigate = useNavigate();
    const {session, login, signOut} = useSession();

    const handleIdChange = (e: FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setUserId(value);
    };

    const handlePwChange = (e: FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setUserPw(value);
    };

    const onLogIn = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId) {
            alert("ID를 입력하세요.");
            return;
        }

        if (!userPw) {
            alert("PW를 입력하세요.");
            return;
        }


        (async function () {
                try {
                    const response = await fetch(
                        'http://localhost:8080/user/login',
                        {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username: userId,
                                password: userPw
                            })
                        });
                    /*
                    userRole
                    jwt => localStorage에 저장한다.
                     */
                    if (response.ok) {
                        alert("로그인 성공했습니다.");

                        const json = await response.json();
                        const customer: User = {
                            username: userId,
                            token: json["jwt"],
                            role: json["userRole"],
                        };

                        login(customer);

                        // 로그인 로직 구현
                        // userRole에 따라 어디로 리다이렉트할지 결정한다.
                        json["userRole"] === "ADMIN" ? navigate('/admin/product') : navigate('/customer/product');
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        alert(`에러가 발생했습니다. (${err}`);
                    }
                }
            }
        )();
    };

    return (
        <>
            <div className={"flex flex-col items-center w-full"}>
                <div className={"font-bold text-3xl"}>ToriShop</div>
                <form onSubmit={onLogIn} className={"p-20 m-10 w-full border-gray-200 border-2 rounded"}>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>아이디</div>
                        <input id="userId"
                               value={userId}
                               onChange={handleIdChange}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>비밀번호</div>
                        <input id="passwordId"
                               value={userPw}
                               onChange={handlePwChange}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div className={"flex justify-center p-20"}>
                        <button
                            className="m-5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            type="submit">로그인
                        </button>
                        <button onClick={() => navigate('/customer/signin')}
                                className="m-5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                        >회원가입</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;