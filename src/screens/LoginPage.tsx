import "./MainStyles/LoginPageStyle.scss"
import {useParams} from "react-router-dom";
import {AuthorizationContent} from "./components/LoginPage/AuthorizationContent.tsx";
import {RegistrationContent} from "./components/LoginPage/RegistrationContent.tsx";
import {IconUserScan} from "@tabler/icons-react";

import {router} from "../router/router.tsx";

export enum LoginPageMode {
    authorization = "Authorization",
    registration = "Registration"
}

export type loginPageProp = {
    onChangeMode: (type: LoginPageMode) => void,
    mode: LoginPageMode
}
const LoginPage = () => {
    const {mode} = useParams<{ mode: string }>();

    const toggleMode = (mode: LoginPageMode) => {
        router.navigate(`/loginPage/${mode}`);
    };

    return (
        <form className="AuthorizationContainer">

            <header>
                <IconUserScan
                    stroke={2}
                    size={200}
                    className="Zalupa"
                />
                <h1>Glyph</h1>
                <p>Рабочее пространство для твоих проектов</p>
            </header>

            <section>
                <button
                    type="button"
                    className={`AuthButton ${
                        mode === LoginPageMode.authorization ? "selected" : ""
                    }`}
                    onClick={() => toggleMode(LoginPageMode.authorization)}
                >
                    Авторизация
                </button>

                <button
                    type="button"
                    className={`RegButton ${
                        mode === LoginPageMode.registration ? "selected" : ""
                    }`}
                    onClick={() => toggleMode(LoginPageMode.registration)}
                >
                    Регистрация
                </button>
            </section>
            <footer>
                {mode === LoginPageMode.authorization && <AuthorizationContent/>}
                {mode === LoginPageMode.registration && <RegistrationContent/>}

            </footer>


        </form>

    );
};
export default LoginPage