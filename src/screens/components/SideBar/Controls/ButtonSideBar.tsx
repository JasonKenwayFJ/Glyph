import {NavLink} from "react-router-dom";
import {ReactNode} from "react";
import "./ButtonSideBar.scss"
interface ButtonSideBarProps {
    label: string;
    icon: ReactNode;
    path: string;
    isCollapsed: boolean;
    onInvokeAssist: () => void;
}

export function ButtonSideBar({ label, icon, path, isCollapsed }: ButtonSideBarProps) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `sidebar-button${isActive ? " sidebar-button--active" : ""}${isCollapsed ? " sidebar-button--collapsed" : ""}`
            }
            title={isCollapsed ? label : undefined}
        >
            <span className="sidebar-button__icon">{icon}</span>
            {!isCollapsed && <span className="sidebar-button__label">{label}</span>}
        </NavLink>
    );
}