import {DesktopSideBar} from "../components/SideBar/DesktopSideBar.tsx";
import {MobileSideBar} from "../components/SideBar/MobileSideBar.tsx";
import "../MainStyles/Panels/SideBarStyle.scss"
export type Button = {
    onInvokeAssistEvent: () => void,
    onInvokeAssist?: () => void
}
const SideBar = ({onInvokeAssistEvent, onInvokeAssist}: Button) => {

    return (
        <div className={"SideBar"}>
            <div className={"DesktopSideBar"}>
                <DesktopSideBar onInvokeAssistEvent={onInvokeAssistEvent} onInvokeAssist={onInvokeAssist}/>
            </div>
            <div className={"MobileSideBar"}>
                <MobileSideBar/>
            </div>
        </div>
    );
};

export default SideBar;

