import "./MainStyles/LoginPageStyle.scss"
import {useParams} from "react-router-dom";
import {AuthorizationContent} from "./components/LoginPage/AuthorizationContent.tsx";
import {RegistrationContent} from "./components/LoginPage/RegistrationContent.tsx";
import {IconUserScan} from "@tabler/icons-react";

import {router} from "../router/router.tsx";
import {ApiResponse} from "../types/ApiResponse.ts";
import {invoke} from "@tauri-apps/api/core";

export enum LoginPageMode {
    authorization = "Authorization",
    registration = "Registration"
}

export type loginPageProp = {
    onChangeMode: (type: LoginPageMode) => void,
    mode: LoginPageMode
}
export type loginRequested = {
    onSend: (email: string, password: string) => void
}

const LoginPage = () => {
    const {mode} = useParams<{ mode: string }>();

    const toggleMode = (mode: LoginPageMode) => {
        router.navigate(`/loginPage/${mode}`);
    };

    async function logIn(email: string, password: string) {
        e.preventDefault();
        let response: ApiResponse<string> = await invoke('login', {email, password})
        console.log(`Получен ответ: ${response.status}: UserId: ${response.data}`)
    }

    async function signUp(username: string, email: string, password: string) {

    }

    return (
        <form className="AuthorizationContainer" onSubmit={e => e.preventDefault()}>

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
                {mode === LoginPageMode.authorization && <AuthorizationContent onSend={logIn}/>}
                {mode === LoginPageMode.registration && <RegistrationContent/>}

            </footer>


        </form>

    );
};
export default LoginPage