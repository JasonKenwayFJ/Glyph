import "./AuthorizationContent.scss"

import "./RegistrationContent.scss"
export const RegistrationContent = () => {
    return(
        <div className={"AuthorizationContent"}>
            <p>Username</p>
            <input type={"text"} required={true} placeholder={"Jabbo"}/>
            <p>Email</p>
            <input type={"email"} required={true} placeholder={"example@gmail.com"}/>
            <p>Password</p>
            <input type={"password"} required={true} placeholder={"********"}/>
            <button>Регистрация</button>
            <p id={"extraInfo"}>
                Продолжая, вы соглашаетесь с условиями использования
            </p>
        </div>
    )
}