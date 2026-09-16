import "./../../MainStyles/Panels/SideBarStyles/DesktopSideBarStyle.scss"
import {
    IconArrowAutofitWidthFilled,
    IconArticleFilled, IconCardsFilled,
    IconChevronLeft,
    IconChevronRight, IconFileDescriptionFilled, IconHeartFilled, IconListDetailsFilled,
    IconMessageChatbotFilled, IconPhotoFilled, IconPictureInPictureFilled,
    IconSettings, IconTrashFilled
} from "@tabler/icons-react";
import {useState} from "react";
import {Button} from "./Toolbar/SideBar.tsx";
import {Toolbar} from "./Toolbar/Toolbar.tsx";
import {ButtonSideBar} from "./Controls/ButtonSideBar.tsx";

export const DesktopSideBar = ({onInvokeAssistEvent}: Button) => {
    const [isCollapsed, setCollapsed] = useState(false);
    const toggleSideBar = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className={`SideBarContainer ${isCollapsed ? "collapsed" : ""}`}>

            <div className={`SidebarWindow ${isCollapsed ? "collapsed" : ""}`}>
                <div className={`SidebarWindowCloser ${isCollapsed ? "collapsed" : ""}`}>

                    {!isCollapsed && <Toolbar isCollapsed={isCollapsed}/>}

                    <div className={"MainSideButtons"}>

                        {!isCollapsed && <button>
                                                <span className="SidebarChevron">
                                                         <IconSettings stroke={2}/>
                                               </span>
                        </button>}
                        <button onClick={toggleSideBar}>
                    <span className="SidebarChevron">
                        {!isCollapsed
                            ? <IconChevronLeft stroke={2}/>
                            : <IconChevronRight stroke={2}/>
                        }
                    </span>
                        </button>
                    </div>

                </div>

                <div className="ButtonList">

                    <ButtonSideBar
                        label={"Ассистент"}
                        icon={<IconMessageChatbotFilled/>}
                        onInvokeAssist={onInvokeAssistEvent}
                        isCollapsed={isCollapsed} path={""} />

                    <div className={"NavButtons"}>
                        <label>Navigation</label>
                        <ButtonSideBar
                            label={"Редактор"}
                            icon={<IconArticleFilled/>}
                            path={"/mainPage"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>

                        <ButtonSideBar
                            label={"Документы"}
                            icon={<IconFileDescriptionFilled/>}
                            path={"/entityPage/Document"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>

                        <ButtonSideBar
                            label={"Карточки"}
                            icon={<IconCardsFilled/>}
                            path={"/entityPage/Card"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>
                    </div>

                    <div className={"NavButtons"}>
                        <label>Explorer</label>
                        <ButtonSideBar
                            label={"Задачи"}
                            icon={<IconListDetailsFilled/>}
                            path={"/entityPage/Task"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>

                        <ButtonSideBar
                            label={"Связи"}
                            icon={<IconArrowAutofitWidthFilled/>}
                            path={"/entityPage/Graph"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>
                        <ButtonSideBar
                            label={"Избранное"}
                            icon={<IconHeartFilled/>}
                            path={"/entityPage/Cards"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>
                        <ButtonSideBar
                            label={"Медиа"}
                            icon={<IconPictureInPictureFilled/>}
                            path={"/entityPage/Cards"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>
                        <ButtonSideBar
                            label={"Аудио"}
                            icon={<IconPhotoFilled/>}
                            path={"/entityPage/Audio"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>
                    </div>

                    <div className={"NavButtons"}>
                        <label>Links</label>
                        <ButtonSideBar
                            label={"Мусор"}
                            icon={<IconTrashFilled/>}
                            path={"/entityPage/Trash"}
                            isCollapsed={isCollapsed} onInvokeAssist={function (): void {
                            throw new Error("Function not implemented.");
                        }}/>

                    </div>

                    <div className={"NavButtons"}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Searcher</label>
                        <input placeholder={isCollapsed ? "" : "Введите текст"}/>
                    </div>

                </div>
            </div>
            <div className="SideBarDivider"></div>
        </div>
    )
}