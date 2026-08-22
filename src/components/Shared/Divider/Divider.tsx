import "./Divider.css"

type DividerProps = {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
}
const Divider = (props: DividerProps) => {
    return (
        <>
            <div className="Divider">
                <span className="DividerTitle">{props.label}</span>

                <div className="DividerLine"></div>

                <button className="DividerButton" onClick={props.onClick}>
                    Показать все
                </button>
            </div>

            {props.children}
        </>
    )
}
export default Divider