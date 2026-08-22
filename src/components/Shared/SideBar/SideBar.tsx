import "./SideBar.css";
import {
    IconArrowAutofitWidthFilled,
    IconArticleFilled, IconCardsFilled,
    IconChevronLeft,
    IconChevronRight, IconFileDescriptionFilled, IconHeartFilled, IconListDetailsFilled,
    IconMessageChatbotFilled, IconPhotoFilled,
    IconPictureInPictureFilled, IconSettings, IconTrashFilled
} from "@tabler/icons-react";
import ButtonSideBar from "./ButtonSideBar/ButtonSideBar.tsx";
import Toolbar from "../Toolbar/Toolbar.tsx";
import {useState} from "react";

type Button = {
    onInvokeAssistEvent: () => void;
}
const SideBar = ({onInvokeAssistEvent} : Button) => {
    const [isCollapsed, setCollapsed] = useState(true);

    const toggleSideBar = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className={`SideBarContainer ${!isCollapsed ? "collapsed" : ""}`}>

            <div className={`SidebarWindow ${!isCollapsed ? "collapsed" : ""}`}>
                <div className={`SidebarWindowCloser ${!isCollapsed ? "collapsed" : ""}`}>


                    {isCollapsed && <Toolbar isCollapsed={isCollapsed}/>}


                    <div style={{display: "flex", flexDirection: "row"}}>

                        {isCollapsed && <button>
                                                <span className="SidebarChevron">
                                                         <IconSettings stroke={2}/>
                                               </span>
                        </button>}
                        <button onClick={toggleSideBar}>
                    <span className="SidebarChevron">
                        {isCollapsed
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
                        isCollapsed={isCollapsed}/>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Navigation</label>
                        <ButtonSideBar
                            label={"Редактор"}
                            icon={<IconArticleFilled/>}
                            path={"/mainPage"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Документы"}
                            icon={<IconFileDescriptionFilled/>}
                            path={"/entity/documents"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Карточки"}
                            icon={<IconCardsFilled/>}
                            path={"/entity/cards"}
                            isCollapsed={isCollapsed}/>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Explorer</label>
                        <ButtonSideBar
                            label={"Задачи"}
                            icon={<IconListDetailsFilled/>}
                            path={"/taskPage"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Связи"}
                            icon={<IconArrowAutofitWidthFilled/>}
                            path={"/graphPage"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Избранное"}
                            icon={<IconHeartFilled/>}
                            path={"/entity/cards"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Медиа"}
                            icon={<IconPictureInPictureFilled/>}
                            path={"/entity/cards"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Изображения"}
                            icon={<IconPhotoFilled/>}
                            path={"/entity/cards"}
                            isCollapsed={isCollapsed}/>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Links</label>
                        <ButtonSideBar
                            label={"Мусор"}
                            icon={<IconTrashFilled/>}
                            path={"/entity/cards"}
                            isCollapsed={isCollapsed}/>

                    </div>

                    <div className="Divider"/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Searcher</label>
                        <input placeholder={!isCollapsed ? "" : "Введите текст"}/>
                    </div>

                </div>
            </div>
            <div className="SideBarDivider"></div>
        </div>
    );
};

export default SideBar;

