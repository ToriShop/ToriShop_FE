import {ChangeEventHandler, FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";

interface CustomerInfo {
    username: string;
    password: string;
    phoneNumber: string;
    email: string;
    address: string;
}

const SignInPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    const handleChangeUsername = (event: FormEvent<HTMLInputElement>) => {
        setUsername(event.currentTarget.value);
    }

    const handleChangePassword = (event: FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }

    const handleChangePhoneNumber = (event: FormEvent<HTMLInputElement>) => {
        setPhoneNumber(event.currentTarget.value);
    }

    const handleChangeEmail = (event: FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    }

    const handleChangeAddress = (event: FormEvent<HTMLInputElement>) => {
        setAddress(event.currentTarget.value);
    }


    function onSubmitBtn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const customer: CustomerInfo = {
            username: username,
            password: password,
            phoneNumber: phoneNumber,
            email: email,
            address: address
        }

        console.log(customer);

        (async function () {
            try {
                const response = await fetch("http://localhost:8080/customer", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(customer)
                })

                if (response.ok) {
                    alert("회원가입이 완료되었습니다.");
                    navigate("/login");
                } else {
                    alert("회원가입 실패했습니다.");
                }
            } catch (err) {
                if (err instanceof Error)
                    alert(`에러가 발생했습니다. : ${err}`);
            }
        })();
    }

    return (
        <>
            <div className={"flex flex-col items-center w-full"}>
                <div className={"font-bold text-3xl"}>회원 가입</div>
                <form onSubmit={onSubmitBtn} className={"p-20 m-10 w-full border-gray-200 border-2 rounded"}>
                    <div id="username">
                        <div className={"inline-flex w-24 font-semibold text-lg"}>username</div>
                        <input type="text"
                               value={username}
                               onChange={handleChangeUsername}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>password</div>
                        <input type="password"
                               value={password}
                               onChange={handleChangePassword}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>phone</div>
                        <input type="text"
                               value={phoneNumber}
                               onChange={handleChangePhoneNumber}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>email</div>
                        <input type="email"
                               value={email}
                               onChange={handleChangeEmail}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div>
                        <div className={"inline-flex w-24 font-semibold text-lg"}>address</div>
                        <input type="text"
                               value={address}
                               onChange={handleChangeAddress}
                               className={"w-1/2 p-1 m-2 border-gray-300 border-2 rounded"}/>
                    </div>
                    <div className={"flex flex-col items-center p-20"}>
                        <button
                            type={"submit"}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                            제출하기
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignInPage;