import {IconAd, IconLock, IconMail, IconUser} from "@tabler/icons-react";
import ButtonLoginSwitcher from "../pages/Login/ButtonLoginSwitcher/ButtonLoginSwitcher.tsx";
import AuthInput from "../pages/Login/AuthInput/AuthInput.tsx";
import {registrationForm} from "../types/Forms.ts";
import {useEffect, useState} from "react";
import {Project} from "../types/Project.ts";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/core";

class AuthForm {
}

export const LoginPage = () => {


    const rForm: registrationForm = {
        username: "",
        email: "",
        password: ""
    };
    const aForm: AuthForm = {
        email: "",
        password: "",
    }

    const [authForm, setAuth] = useState(aForm);
    const [regForm, setReg] = useState(rForm)
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setLoading] = useState(false);
    const [login, setLogin] = useState(true);

    const navigate = useNavigate();



    useEffect(() => {
        const getProject = async () => {
            setProject(await invoke<Project>("get_project"))
        }
        getProject();
    }, []);

    function setAuthData(
        field: string,
        value: string
    ) {
        setAuth(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function setRegData(
        field: keyof typeof rForm,
        value: string
    ) {
        setReg(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function ToggleLoginRegister(isLoginMode: boolean) {
        setAuth(aForm)
        setLogin(isLoginMode);

    }


    async function registration(payload: registrationForm){

    }

    if (isLoading) {
        return <h1>Загрузка</h1>
    }

    return (
        <div className="LoginPage">
            {login ?

                <div className="LoginContainer">
                    <form className="LoginForm"
                          onSubmit={async (e) => {
                              e.preventDefault();
                              setLoading(true)

                              // const payload: authForm = {
                              //     email: authForm.email,
                              //     password: authForm.password
                              // };

                              try {


                                  if (!project)
                                      navigate("/");
                                  else
                                      navigate("/projectPage")
                              } catch (e) {
                                  console.error(e)
                                  setLoading(false)
                                  return;
                              }

                              setLoading(false)
                          }}
                    >

                        <section className="LoginHeader">
                            <IconUser stroke={2} size={100}/>
                            <h1>Glyph</h1>
                            <p className="LoginSubtitle">
                                Хаб для разработки твоего проекта
                            </p>
                        </section>
                        <div className="LoginSwitcher">
                            <ButtonLoginSwitcher
                                isSelected={!login}
                                text="Авторизация"
                                onClick={() => ToggleLoginRegister(true)}/>
                            <ButtonLoginSwitcher
                                isSelected={login}
                                text="Регистрация"
                                onClick={() => ToggleLoginRegister(false)}/>
                        </div>


                        <AuthInput
                            icon={<IconMail size={16}/>
                            }
                            type="email"
                            placeholder="you@example.com"

                            onChange={
                                (value) => setAuthData("email", value)
                            }
                        />

                        <AuthInput
                            icon={<IconLock size={16}/>}
                            type="password"
                            placeholder="••••••••"
                            onChange={(value) => setAuthData("password", value)}
                        />

                        <div className="ForgotPassword">
                            <a href="#">Forgot your password?</a>
                        </div>
                        <button
                            type="submit"
                            onClick={() => {
                            }}
                            disabled={isLoading}

                        >
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                        <div className="SimpleDivider">

                            <div className="hr-text">или</div>
                        </div>
                        <div className="AuthViaServices">
                            <button>Google</button>
                            <button>Я</button>
                        </div>
                    </form>
                </div>


                :


                <div className="LoginContainer">
                    <form className="LoginForm" onSubmit={async (e) => {
                        e.preventDefault();
                        const payload: registrationForm = {
                            username: regForm.username,
                            email: regForm.email,
                            password: regForm.password
                        };

                        try {
                            const response = await registration(payload)
                            console.log(response)
                            navigate("/");
                        } catch (e) {
                            console.error(e)
                            return;
                        }
                    }
                    }>
                        <section className="LoginHeader">
                            <IconUser stroke={2} size={100}/>
                            <h1>Glyph</h1>
                            <p className="LoginSubtitle">
                                Хаб для разработки твоего проекта
                            </p>
                        </section>
                        <div className="LoginSwitcher">
                            <ButtonLoginSwitcher
                                isSelected={!login}
                                text="Авторизация"
                                onClick={() => ToggleLoginRegister(true)}/>
                            <ButtonLoginSwitcher
                                isSelected={login}
                                text="Регистрация"
                                onClick={() => ToggleLoginRegister(false)}/>
                        </div>


                        <AuthInput
                            icon={<IconAd size={16}/>}
                            type="text"
                            placeholder="username"
                            onChange={(value) => setRegData("username", value)}
                        />
                        <AuthInput
                            icon={<IconMail size={16}/>}
                            type="email"
                            placeholder="you@example.com"
                            onChange={(value) => setRegData("email", value)}
                        />

                        <AuthInput
                            icon={<IconLock size={16}/>}
                            type="password"
                            placeholder="••••••••"
                            onChange={(value) => setRegData("password", value)}
                        />

                        <div className="ForgotPassword">
                            <a href="#">Forgot your password?</a>
                        </div>


                        <button
                            type="submit"
                            onClick={() => {
                            }}
                            disabled={isLoading}>
                            {isLoading ? "Loading..." : "Создать аккаунт"}
                        </button>


                        <div className="SimpleDivider">

                            <div className="hr-text">или</div>
                        </div>
                        <div className="AuthViaServices">
                            <button>Google</button>
                            <button>Я</button>
                        </div>

                    </form>


                </div>


            }


        </div>
    )
}