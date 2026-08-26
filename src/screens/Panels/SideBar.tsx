import "./../MainStyles/Panels/SideBarStyles/SideBarStyle.scss";
import {
    IconArrowAutofitWidthFilled,
    IconArticleFilled, IconCardsFilled,
    IconChevronLeft,
    IconChevronRight, IconFileDescriptionFilled, IconHeartFilled, IconListDetailsFilled,
    IconMessageChatbotFilled, IconPhotoFilled,
    IconPictureInPictureFilled, IconSettings, IconTrashFilled
} from "@tabler/icons-react";

import {useState} from "react";
import Toolbar from "../components/SideBar/Toolbar/Toolbar.tsx";
import ButtonSideBar from "../components/SideBar/ButtonSideBar/ButtonSideBar.tsx";

type Button = {
    onInvokeAssistEvent: () => void,
    onInvokeAssist?: () => void
}
const SideBar = ({onInvokeAssistEvent}: Button) => {
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

                    <div className={"NavButtons"}>
                        <label>Navigation</label>
                        <ButtonSideBar
                            label={"Редактор"}
                            icon={<IconArticleFilled/>}
                            path={"/mainPage"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Документы"}
                            icon={<IconFileDescriptionFilled/>}
                            path={"/entityPage/Documents"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Карточки"}
                            icon={<IconCardsFilled/>}
                            path={"/entityPage/Card"}
                            isCollapsed={isCollapsed}/>
                    </div>

                    <div className={"NavButtons"}>
                        <label>Explorer</label>
                        <ButtonSideBar
                            label={"Задачи"}
                            icon={<IconListDetailsFilled/>}
                            path={"/entityPage/Task"}
                            isCollapsed={isCollapsed}/>

                        <ButtonSideBar
                            label={"Связи"}
                            icon={<IconArrowAutofitWidthFilled/>}
                            path={"/entityPage/Graph"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Избранное"}
                            icon={<IconHeartFilled/>}
                            path={"/entityPage/Cards"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Медиа"}
                            icon={<IconPictureInPictureFilled/>}
                            path={"/entityPage/Cards"}
                            isCollapsed={isCollapsed}/>
                        <ButtonSideBar
                            label={"Аудио"}
                            icon={<IconPhotoFilled/>}
                            path={"/entityPage/Audio"}
                            isCollapsed={isCollapsed}/>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label>Links</label>
                        <ButtonSideBar
                            label={"Мусор"}
                            icon={<IconTrashFilled/>}
                            path={"/entityPage/Trash"}
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

