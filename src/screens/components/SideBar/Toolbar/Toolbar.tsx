import "./../../../MainStyles/Panels/ToolbarStyle.scss"
import {useEffect, useRef, useState} from "react";
import {router} from "../../../../router/router.tsx";
import {listen} from '@tauri-apps/api/event'
import {Project} from "../../../../types/Project.ts";
import {useNavigate} from "react-router-dom";


export const Toolbar = ({isCollapsed}: ToolbarProp) => {

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
    const ref = useRef<HTMLDivElement>(null);


    // useEffect(() => {
    //     const handleClick = (event: MouseEvent) => {
    //         const target = event.target as Node;
    //
    //         if (!ref.current?.contains(target)) {
    //             toggleMainButton(false);
    //         }
    //     };
    //
    //     document.addEventListener("mouseover", handleClick);
    //
    //     return () => {
    //         document.removeEventListener("mouseover", handleClick);
    //     };
    // }, []);



    function toggleMainButton(value: boolean) {
        setOpen(value)
    }

    let isAuthorized: boolean = false;

    return (
        <div className={`ToolbarMenu ${isCollapsed ? "collapsed" : ""}`}>


            <div className="WindowTitle" ref={ref} onClick={() => toggleMainButton(!isOpen)}>
                <label style={{display: "block", margin: 0}}>Glyph</label>
                <p style={{display: "block", marginTop: 0, width: 100}}>{project?.title ?? "Без проекта"}</p>
                {isOpen &&
                    <div className="dropDownPanel">
                        <button className="dropDownButton">
                            <p>Новый проект</p>
                        </button>
                        <button className="dropDownButton" onClick={() => router.navigate("/projectPage")}>
                            <p>Сменить проект</p></button>
                        <button className="dropDownButton" id={"mainButtonsToolbar"}>
                            <p>Настройки</p>
                        </button>

                        {isAuthorized ? (
                            <button
                                className="dropDownButton"
                                onClick={() => router.navigate("/loginPage") }>
                                <p>Выйти из аккаунта</p>
                            </button>
                        ) : (
                            <button
                                className="dropDownButton"
                                onClick={() => router.navigate("/loginPage/Authorization")}
                            >
                                <p>Войти</p>
                            </button>
                        )}

                        <button className="dropDownButton">
                            <p>Выйти</p>
                        </button>
                    </div>}
            </div>


        </div>
    )
}



