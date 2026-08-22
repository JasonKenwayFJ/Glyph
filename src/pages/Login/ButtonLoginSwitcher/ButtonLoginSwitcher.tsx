import "./ButtonLoginSwitcher.css"

type ButtonLoginSwitcherProps = {
    onClick: () => void;
    text: string;
    isSelected: boolean;
};
const ButtonLoginSwitcher = ({
                                 isSelected,
                                 text,
                                 onClick
                             }: ButtonLoginSwitcherProps) => {
    return (
        <button
            className={isSelected
                ? "SelectedButtonLoginSwitcher"
                : "ButtonLoginSwitcher"
            }
            onClick={onClick}
        >
            {text}
        </button>
    );
};
export default ButtonLoginSwitcher;