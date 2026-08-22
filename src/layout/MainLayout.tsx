import {Outlet} from "react-router-dom";
import Sidebar from "./../components/Shared/SideBar/SideBar.tsx";
import "./MainLayout.css"
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {useState} from "react";

export default function MainLayout() {
    const [isSideBarOpen, setSideBarState] = useState<boolean>(true)

    function toggleSideBar(value: boolean) {
        setSideBarState(value)
    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <div className="sBar">
                {isSideBarOpen && <Sidebar onInvokeAssist={() => toggleSideBar(!isSideBarOpen)}/>}
            </div>
            <main style={{flex: 1, overflow: "auto"}}>
                <button className="sBarButton" onClick={() => toggleSideBar(!isSideBarOpen)}>
                    {isSideBarOpen ? <IconChevronLeft stroke={2}/> :
                        <IconChevronRight stroke={2}/>}
                </button>
                <Outlet/>
            </main>
        </div>
    );
}