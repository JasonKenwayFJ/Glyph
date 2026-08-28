import {Outlet} from "react-router-dom";
import "./MainLayout.css"

import {useState} from "react";
import Sidebar from "../screens/components/SideBar/Toolbar/SideBar.tsx"
export default function MainLayout() {
    const [isSideBarOpen, setSideBarState] = useState<boolean>(true)
    const [isAiChatOpen, setAiChat] = useState<boolean>(false)

    function toggleSideBar(value: boolean) {
        setSideBarState(value)
    }
    function toggleAiChatPanel(value: boolean){
        setAiChat(value);
    }

    return (
        <div className={"MainLayout"}>
            <div className="sBar">
                {isSideBarOpen && <Sidebar onInvokeAssistEvent={() => toggleAiChatPanel(!isAiChatOpen)} onInvokeAssist={() => toggleSideBar(!isSideBarOpen)}/>}
            </div>
            <main style={{flex: 1, overflow: "auto"}}>
                <Outlet/>
            </main>
            {/*{isAiChatOpen && isSubsribed && <AIChat/>}*/}
        </div>
    );
}