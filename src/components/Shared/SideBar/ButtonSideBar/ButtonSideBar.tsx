import "./ButtonSideBar.css"
import {router} from "../../../../router/router.tsx";

type ButtonSideBarProp = {
    label: string,
    icon: React.JSX.Element,
    path?: string,
    isCollapsed: boolean
    onInvokeAssist?: () => void;
}
const ButtonSideBar = ({
                           label,
                           icon,
                           path,
                           isCollapsed,
                           onInvokeAssist
                       }: ButtonSideBarProp) => {
    const action = path
        ? () => router.navigate(path)
        : onInvokeAssist;
    return (
        <button className={"ButtonSideBar"} onClick={action}>
            <div className={"ButtonSideBarContent"}>
                    <span className={`ButtonSideBarIcon ${isCollapsed ? "" : "collapsed"}`}>
                        {icon}
                    </span>
                <span className={`ButtonSideBarLabel ${isCollapsed ? "" : "collapsed"}`}>{label}</span>
            </div>
        </button>
    )
}
export default ButtonSideBar