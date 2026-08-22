import { useState } from "react";
import "./Dropdown.css";

type DropdownProps<T> = {
    getLabel: string;
    items: T[];
    onSelect: (item: T) => void;
};

const Dropdown = <T,>({
                          getLabel,
                          items,
                          onSelect
                      }: DropdownProps<T>) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<T | null>(null);

    const handleSelect = (item: T) => {
        setSelected(item);
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className="Dropdown">

            <button
                className="DropdownButton"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {selected !== null ? String(selected) : getLabel}
                <span>⌄</span>
            </button>

            {isOpen && (
                <div className="DropdownMenu">
                    {items.map((item, index) => (
                        <div
                            className="DropdownItem"
                            key={index}
                            onClick={() => handleSelect(item)}
                        >
                            {String(item)}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Dropdown;