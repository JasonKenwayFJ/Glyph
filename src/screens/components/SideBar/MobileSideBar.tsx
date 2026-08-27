import "./../../MainStyles/Panels/SideBarStyles/MobileSideBarStyle.scss"
import {MobileDropDownSideBar} from "./Controls/MobileDropDownSideBar.tsx";
import {
    IconAffiliate,
    IconBinoculars,
    IconDatabase,
    IconImageGeneration,
    IconRobot,
    IconSettings
} from "@tabler/icons-react";

export const MobileSideBar = () => {
    return(
        <div className={"MobileSideBarContainer"}>
            {/*<span><IconArrowNarrowUpDashed stroke={2} size={50}/></span>*/}
            <MobileDropDownSideBar
                label={""}
                icon={<IconRobot stroke={2} size={50} />}
                isCollapsed={false} />
            <MobileDropDownSideBar
                label={""}
                icon={<IconImageGeneration stroke={2} size={50}/>}
                isCollapsed={false} />
            <MobileDropDownSideBar
                label={""}
                icon={<IconBinoculars stroke={2} size={50}/>}
                isCollapsed={false} />
            <MobileDropDownSideBar
                label={""}
                icon={<IconDatabase stroke={2} size={50}/>}
                isCollapsed={false} />
            <MobileDropDownSideBar
                label={""}
                icon={<IconAffiliate stroke={2} size={50}/>}
                isCollapsed={false} />
            <MobileDropDownSideBar
                label={""}
                icon={<IconSettings stroke={2} size={50}/>}
                isCollapsed={false} />
        </div>
    )
}





