import "./AuthorizationContent.scss"


export const AuthorizationContent = () => {
    return (
        <div className={"AuthorizationContent"}>
            <p>Email</p>
            <input type={"email"} required={true} placeholder={"example@gmail.com"}/>
            <p>Password</p>
            <input type={"password"} required={true} placeholder={"********"}/>
            <button>Войти</button>
            <p id={"extraInfo"}>
                Продолжая, вы соглашаетесь с условиями использования
            </p>
        </div>
    )
}
