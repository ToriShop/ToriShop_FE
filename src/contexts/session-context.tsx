import {createContext, PropsWithChildren, useCallback, useContext, useReducer} from "react";
import exp from "node:constants";
import {ProductType} from "../pages/public/common/Type";

enum ROLE {
    USER_ADMIN = "admin",
    USER_CUSTOMER = "customer"
}

export type User = {
    username: string,
    token: string,
    role: ROLE
}

export type Cart = {
    productId: number;
    productName: string;
    isInOrder: boolean;
    price: number;
    quantity: number;
}

export type Session = {
    user: User | null;
    cart: Cart[];
}

type SessionContextProps = {
    session: Session
    setCart: (cart: Cart[]) => void
    login: (user: User) => void
    signOut: () => void
    saveItem: (cart: Cart) => void
    removeItem: (id: number) => void
    plusQuantity: (id: number) => void
    minusQuantity: (id: number) => void
    isInOrder: (id: number, isInOrder: boolean) => void
    clearCart: () => void
}

const DefaultSession: Session = {
    user: null,
    cart: []
};

const SessionContext = createContext<SessionContextProps>({
    session: DefaultSession,
    setCart: (cart: Cart[]) => {
    },
    login: () => {
    },
    signOut: () => {
    },
    saveItem: () => {
    },
    removeItem: (id: number) => {
    },
    plusQuantity: (id: number) => {
    },
    minusQuantity: (id: number) => {
    },
    isInOrder: (id: number, isInOrder: boolean) => {
    },
    clearCart: () => {
    }
});

type Action = {
    type: 'setCart';
    payload: Cart[];
} | {
    type: 'login';
    payload: User | null;
} | {
    type: 'signOut';
    payload?: User | null;
} | {
    type: 'saveItem';
    payload: Cart
} | {
    type: 'removeItem';
    payload: number
} | {
    type: 'plusQuantity';
    payload: number;
} | {
    type: 'minusQuantity';
    payload: number;
} | {
    type: 'isInOrder';
    payload: { id: number, isInOrder: boolean }
} | {
    type: 'clearCart';
    payload?: null;
}

const SKEY = 'session';

function getStorage() {
    const storedData = localStorage.getItem(SKEY);
    if (storedData) {
        return JSON.parse(storedData) as Session;
    }

    setStorage(DefaultSession);

    return DefaultSession;
}

const setStorage = (session: Session) => {
    localStorage.setItem(SKEY, JSON.stringify(session));
}

const clearStorage = () => {
    localStorage.clear();
}

function reducer(state: Session, {type, payload}: Action) {
    let newSession: Session = state;
    const {cart} = state;

    switch (type) {
        case "setCart":
            newSession = {...state, cart: payload};
            break
        case "login":
            newSession = {...state, user: payload};
            break
        case "signOut":
            newSession = {...state, user: null};
            break
        case "removeItem": {
            const newCart = state.cart.filter((item) => (item.productId != payload))
            newSession = {...state, cart: newCart};
            break
        }
        case "saveItem": {
            const {cart} = state;
            newSession = {...state, cart: [...cart, payload]}
            break
        }
        case "plusQuantity": {
            const updatedCart = cart.map((item) => {
                if (item.productId == payload) {
                    return {...item, quantity: item.quantity + 1};
                }
                return item;
            });
            newSession = {...state, cart: updatedCart};
            break
        }
        case "minusQuantity": {
            const updatedCart = cart.map((item) => {
                if (item.productId == payload) {
                    return {...item, quantity: Math.max(item.quantity - 1, 1)};
                }
                return item;
            });

            newSession = {...state, cart: updatedCart};
            break
        }
        case "isInOrder": {
            const {id, isInOrder} = payload;
            const updatedCart = cart.map((item) => {
                if (item.productId === id) {
                    return {...item, isInOrder: isInOrder};
                }
                return item;
            });
            newSession = {...state, cart: updatedCart};
            break
        }
        case "clearCart": {
            clearStorage();
            newSession = {...state, cart: []};
            break
        }
        default:
            return state;
    }

    setStorage(newSession);
    return newSession;
}

export const SessionProvider = ({children}: PropsWithChildren) => {
    const [session, dispatch] = useReducer(reducer, getStorage());

    const login = useCallback((user: User) => {
        dispatch({type: 'login', payload: user});
        if (session.user) {
            const token = session.user.token;
            (async function () {

                const response = await fetch(`http://localhost:8080/cart`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "AUTH-TOKEN": token
                    }
                });

                if (response.ok) {
                    const json = await response.json();
                    setCart(json as Cart[]);
                }
            })();
        }
    }, []);

    const signOut = useCallback(() => {
        dispatch({type: 'signOut'});
        if (session.user) {
            let {token} = session.user;
            let cart = session.cart;

            cart.map((item) => {
                (async function () {
                    try {
                        const response = await fetch(`http://localhost:8080/cart`, {
                            method: "put",
                            headers: {
                                "Content-Type": "application/json",
                                "AUTH-TOKEN": token,
                            },
                            body: JSON.stringify({
                                productId: item.productId,
                                isInOrder: item.isInOrder,
                                quantity: item.quantity
                            })
                        });

                        if (response.ok) {
                            localStorage.clear();
                            return;
                        } else {
                            alert("장바구니 조회에 실패했습니다.");
                        }
                    } catch (err) {
                        alert("장바구니 조회에 실패했습니다.");
                    }
                })();
            });
        }
    }, []);

    const setCart = useCallback((cart: Cart[]) => {
        dispatch({type: 'setCart', payload: cart});
    }, []);

    const saveItem = useCallback((cart: Cart) => {
        dispatch({type: 'saveItem', payload: cart});
    }, []);

    const removeItem = useCallback((id: number) => {
        dispatch({type: 'removeItem', payload: id});
    }, []);

    const plusQuantity = useCallback((id: number) => {
        dispatch({type: 'plusQuantity', payload: id});
    }, []);

    const minusQuantity = useCallback((id: number) => {
        dispatch({type: 'minusQuantity', payload: id});
    }, []);

    const clearCart = useCallback(() => {
        dispatch({type: 'clearCart'});
    }, []);


    const isInOrder = useCallback((id: number, isInOrder: boolean) => {
        dispatch({type: 'isInOrder', payload: {id, isInOrder}});
    }, []);


    return (
        <SessionContext.Provider
            value={{session, login, signOut, setCart, saveItem, removeItem, plusQuantity, minusQuantity, isInOrder, clearCart}}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext<SessionContextProps>(SessionContext);