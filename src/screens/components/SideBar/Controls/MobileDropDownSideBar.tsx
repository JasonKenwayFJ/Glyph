import "./../../../MainStyles/Panels/SideBarStyles/DropDownSideBar.scss"
import {ButtonSideBarProp} from "../ButtonSideBar/ButtonSideBar.tsx";
import {router} from "../../../../router/router.tsx";

export const MobileDropDownSideBar
    = ({
           icon,
           path,
           onInvokeAssist
       }: ButtonSideBarProp) => {


    const action = path
        ? () => router.navigate(path)
        : onInvokeAssist;
    return (
        <div className={"MobileDropDownSideBarContainer"}>
            <button onClick={action}>
                <span>
                    {icon}
                </span>
            </button>
        </div>
    )
}