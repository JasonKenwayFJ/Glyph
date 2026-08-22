import "./FilterItem.css"

type FilterItemProps = {
    label?: string;
    quantity?: number;
    icon?: React.ReactNode;
    mode?: string;
    onFilter: () => void;
};

const FilterItem = ({ label, quantity, icon, mode, onFilter }: FilterItemProps) => {
    if (mode === "empty") {
        return (
            <div className="FilterItemContainer" id="AddFilterItem">
                <button className="AddFilterItemButton">
                    <span className="AddFilterItemSpan">+</span>
                    Пустой фильтр
                </button>
            </div>
        );
    }

    return (
        <div className="FilterItemContainer" onClick={onFilter}>
            <div className="FilterItem">
                <div className={`FilterItemInfo ${mode !== "main" ? "muted" : ""}`}>
                    <span className="FilterItemIcon">{icon}</span>
                    <span className="FilterItemLabel">{label}</span>
                </div>
                <div className="FilterItemQuantity">
                    <span>{quantity}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterItem;