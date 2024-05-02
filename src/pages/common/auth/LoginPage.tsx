import {ChangeEvent, FormEvent, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [userId, setUserId]  = useState('');
    const [userPw, setUserPw] = useState('');
    const navigate = useNavigate();

    const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setUserId(value);
    };

    const handlePwChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setUserPw(value);
    };

    const onLogIn = (e: FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("ID를 입력하세요.");
            return;
        }

        if (!userPw) {
            alert("PW를 입력하세요.");
            return;
        }

        (async function() {
             try {
                 const res = await fetch(`로그인 api`);
                 /*
                 userRole
                 jwt => localStorage에 저장한다.
                  */
                 if(res.ok) {
                     alert("로그인 성공했습니다.")
                     // 로그인 로직 구현
                     // userRole에 따라 어디로 리다이렉트할지 결정한다.
                     navigate('/admin/order');
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
            <div>
                <h1>ToriShop</h1>
                <form onSubmit={onLogIn}>
                    <label>아이디</label>
                    <input id="userId" value={userId} onChange={handleIdChange}/>
                    <label>비밀번호</label>
                    <input id="passwordId" value={userPw} onChange={handlePwChange}/>
                    <div>
                        <button
                            type="submit">로그인</button>
                        <button>회원가입</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;