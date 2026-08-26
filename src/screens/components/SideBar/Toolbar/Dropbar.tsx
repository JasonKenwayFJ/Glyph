import {useState} from "react";
import "./Dropbar.css";
import type {DropbarItems} from "./ToolbarData.tsx"
const Dropbar = (prop : DropbarItems) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="Dropbar">
            <button
                className="DropbarButton"
                onClick={() => setOpen(prev => !prev)}
            >
                {prop.label}
                <span>⌄</span>
            </button>

            {open && (
                <div className="DropbarMenu">
                    {prop.items.map(item => (
                        <button
                            key={item.itemTitle}
                            className="DropbarItem"
                            onClick={() => {
                                setOpen(false);
                                item.onPick()
                            }}
                        >
                            {item.itemTitle}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropbar;