import './../../MainStyles/Panels/ToolbarStyle.scss';
import {IconChevronLeft, IconChevronRight, IconSettings} from '@tabler/icons-react';
import {useState} from 'react';
import {useMemo} from 'react';
import {ButtonSideBar} from './Controls/ButtonSideBar.tsx';
import {useSidebarStorage} from '../../../Storage/ToolbarStorage.ts';
import {useNavigate} from "react-router-dom";

export const DesktopSideBar = () => {
    const navigate = useNavigate();
    const [isCollapsed, setCollapsed] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const rawButtons = useSidebarStorage((state) => state.buttons);
    const buttons = useMemo(
        () => [...rawButtons].sort((a, b) => a.order - b.order),
        [rawButtons]
    );
    const toggleSideBar = () => setCollapsed((prev) => !prev);
    const toggleDropDown = () => setDropDown(!dropDown)
    return (
        <div className={`SideBarContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <div className={`SidebarWindow ${isCollapsed ? 'collapsed' : ''}`}>
                <div className={`SidebarWindowCloser ${isCollapsed ? 'collapsed' : ''}`}>
                    <div className="MainSideButtons">
                        <div className="MainSideData">
                            <span className="AppName" onClick={toggleDropDown}>Glyph</span>

                            <button className="ProjectName">
                                Project
                            </button>

                            {dropDown && <div className="ProjectDropdown">
                                <button className={"dropDownButton"}>Войти</button>
                                <button className={"dropDownButton"}>Новый проект</button>
                                <button className={"dropDownButton"}>Сменить проект</button>
                                <button className={"dropDownButton"}>Сохранить проект</button>
                                <button className={"dropDownButton"} onClick={() => navigate("/editorCodePage")}>Плагин</button>
                                <button className={"dropDownButton"}>Выход из приложения</button>
                            </div>}
                        </div>
                        <div className={"MainSideButtons"}>

                        {!isCollapsed && (
                            <button>
                                <span className="SidebarChevron">
                                    <IconSettings stroke={2} />
                                </span>
                            </button>
                        )}
                        <button onClick={toggleSideBar}>
                            <span className="SidebarChevron">
                                {!isCollapsed ? <IconChevronLeft stroke={2}/> : <IconChevronRight stroke={2}/>}
                            </span>
                        </button>
                        </div>
                    </div>
                </div>

                <div className="ButtonList">
                    <ButtonSideBar
                        id="assistant"
                        type="action"
                        label="Ассистент"
                        icon="assistant"
                        onClick={() => {/* открыть ассистента */
                        }}
                        isCollapsed={isCollapsed}
                        order={-1}
                    />

                    <div className="NavButtons">
                        <label>Navigation</label>
                        {buttons.slice(0, 3).map((button) => (
                            <ButtonSideBar key={button.id} {...button} isCollapsed={isCollapsed}/>
                        ))}
                    </div>

                    <div className="NavButtons">
                        <label>Explorer</label>
                        {buttons.slice(3, 8).map((button) => (
                            <ButtonSideBar key={button.id} {...button} isCollapsed={isCollapsed}/>
                        ))}
                    </div>

                    <div className="NavButtons">
                        <label>Links</label>
                        {buttons.slice(8).map((button) => (
                            <ButtonSideBar key={button.id} {...button} isCollapsed={isCollapsed}/>
                        ))}
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <label>Searcher</label>
                        <input placeholder={isCollapsed ? '' : 'Введите текст'}/>
                    </div>
                </div>
            </div>
            <div className="SideBarDivider"></div>
        </div>
    );
};