import "./AuthorizationContent.scss"
import {useState} from "react";

export type loginRequested = {
    onSend: (email: string, password: string) => void
}
export const AuthorizationContent = ({onSend}: loginRequested) => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    function submit(){
        onSend(email, password)
    }

    return (
        <div className={"AuthorizationContent"}>
            <p>Email</p>
            <input
                type={"email"}
                required={true}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={"example@gmail.com"}/>
            <p>Password</p>
            <input
                type={"password"}
                required={true}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={"********"}/>
            <button onClick={() => submit()}>Войти</button>
            <p id={"extraInfo"}>
                Продолжая, вы соглашаетесь с условиями использования
            </p>
        </div>
    )
}
