import {createContext, PropsWithChildren, useCallback, useContext, useReducer} from "react";
import exp from "node:constants";

enum ROLE {
    USER_ADMIN = "admin",
    USER_CUSTOMER = "customer"
}

export type User = {
    username: string,
    token: string,
    role: ROLE
}

export type Session = {
    user: User | null;
}

type SessionContextProps = {
    session: Session
    login: (user: User) => void
    signOut: () => void
}

const DefaultSession: Session = {
    user: null
};

const SessionContext = createContext<SessionContextProps>({
    session: DefaultSession,
    login: () => {
    },
    signOut: () => {
    },
});

type Action = {
    type: 'set';
    payload: Session;
} | {
    type: 'login';
    payload: User | null;
} | {
    type: 'signOut';
    payload?: User | null;
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

function reducer(state: Session, {type, payload}: Action) {
    let newSession: Session = state;

    switch (type) {
        case "set":
            newSession = {...payload};
            break
        case "login":
            newSession = {...state, user: payload}
            break
        case "signOut":
            newSession = {...state, user: null};
            break
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
    }, []);

    const signOut = useCallback(() => {
        dispatch({type: 'signOut'});
    }, []);

    const set = useCallback(() => {
        dispatch({type: 'set', payload: getStorage()});
    }, []);

    return (
        <SessionContext.Provider value={{session, login, signOut}}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext<SessionContextProps>(SessionContext);