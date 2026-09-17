import { NavLink } from 'react-router-dom';
import './ButtonSideBar.scss';
import { ICON_MAP, SidebarButtonDescriptor } from '../../../../Storage/ToolbarStorage.ts';

type ButtonSideBarProps = SidebarButtonDescriptor & { isCollapsed: boolean };

export function ButtonSideBar(props: ButtonSideBarProps) {
    const { label, icon, isCollapsed } = props;
    const IconComponent = ICON_MAP[icon];

    const content = (
        <>
            <span className="sidebar-button__icon">{IconComponent && <IconComponent />}</span>
            {!isCollapsed && <span className="sidebar-button__label">{label}</span>}
        </>
    );

    if (props.type === 'nav') {
        return (
            <NavLink
                to={props.path}
                className={({ isActive }) =>
                    `sidebar-button${isActive ? ' sidebar-button--active' : ''}${isCollapsed ? ' sidebar-button--collapsed' : ''}`
                }
                title={isCollapsed ? label : undefined}
            >
                {content}
            </NavLink>
        );
    }

    return (
        <button
            onClick={props.onClick}
            className={`sidebar-button${isCollapsed ? ' sidebar-button--collapsed' : ''}`}
            title={isCollapsed ? label : undefined}
        >
            {content}
        </button>
    );
}