import "./Toolbar.css"
import {useEffect, useRef, useState} from "react";
import {router} from "../../../router/router.tsx";
import {clearToken, isVerified, subscribeAuth} from "../../../services/Network/AuthorizationService.ts";
import {listen} from '@tauri-apps/api/event'

type ToolbarProp = {
    isCollapsed: boolean
}
const Toolbar = ({isCollapsed} : ToolbarProp) => {

    const [project, setProject] = useState<Project>();

    useEffect(() => {
        const unlisten = listen<Project>('OnProjectChanged', (event) => {
            console.log('Проект изменился:', event.payload)
            setProject(event.payload)
        })

        return () => {
            unlisten.then(fn => fn()) // отписка при размонтировании компонента
        }
    }, [])




    const [isOpen, setOpen] = useState<boolean>(false)
    const [Verified, setVerified] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (!ref.current?.contains(target)) {
                toggleMainButton(false);
            }
        };

        document.addEventListener("mouseover", handleClick);

        return () => {
            document.removeEventListener("mouseover", handleClick);
        };
    }, []);
    useEffect(() => {
        isVerified().then(setVerified);
        return subscribeAuth(setVerified)
    }, []);


    function toggleMainButton(value: boolean) {
        setOpen(value)
    }


    return (
        <div className={`Toolbar ${isCollapsed ? "collapsed" : ""}`}>


            <div className="WindowTitle" ref={ref} onClick={() => toggleMainButton(!isOpen)}>
                <label style={{display: "block",margin: 0}}>Glyph</label>
                <p style={{display: "block", marginTop: 0, width: 100}}>{project?.title ?? "Без проекта"}</p>
                {isOpen &&
                    <div className="dropDownPanel">
                        <button className="dropDownButton">
                            <p>Новый проект</p>
                        </button>
                        <button className="dropDownButton" onClick={() => router.navigate("/projectPage")}>
                            <p>Сменить проект</p></button>
                        <button className="dropDownButton">
                            <p>Настройки</p>
                        </button>

                        {Verified ? (
                            <button
                                className="dropDownButton"
                                onClick={clearToken}
                            >
                                <p>Выйти из аккаунта</p>
                            </button>
                        ) : (
                            <button
                                className="dropDownButton"
                                onClick={() => router.navigate("/login")}
                            >
                                <p>Войти</p>
                            </button>
                        )}

                        <button className="dropDownButton">
                            <p>Выйти</p>
                        </button>
                    </div>}
            </div>


            <div>

            </div>
        </div>
    )
}
export default Toolbar