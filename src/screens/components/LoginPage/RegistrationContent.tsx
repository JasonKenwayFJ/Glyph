import "./AuthorizationContent.scss"

import "./RegistrationContent.scss"
export const RegistrationContent = () => {
    return(
        <div className={"AuthorizationContent"}>
            <p>Username</p>
            <input type={"text"} placeholder={"Jabbo"}/>
            <p>Email</p>
            <input type={"email"} placeholder={"example@gmail.com"}/>
            <p>Password</p>
            <input type={"password"} placeholder={"********"}/>
            <button>Регистрация</button>
            <p id={"extraInfo"}>
                Продолжая, вы соглашаетесь с условиями использования
            </p>
        </div>
    )
}