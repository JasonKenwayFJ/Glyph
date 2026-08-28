import "./AuthorizationContent.scss"


export const AuthorizationContent = () => {
    return (
        <div className={"AuthorizationContent"}>
            <p>Email</p>
            <input type={"email"}  placeholder={"example@gmail.com"}/>
            <p>Password</p>
            <input type={"password"}  placeholder={"********"}/>
            <button>Войти</button>
            <p id={"extraInfo"}>
                Продолжая, вы соглашаетесь с условиями использования
            </p>
        </div>
    )
}
