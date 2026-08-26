import "./CardStyle.scss"
import {EntityProp} from "../../../../types/Props.ts";



type CardProps = EntityProp & {
    onClick: () => void;
};
const Card = ({data, onClick}: CardProps) => {


    if (!data) {
        return (
            <div onClick={onClick} className="CardContainer">
            <h1 style={{fontSize: "3rem", textAlign: "center", userSelect: "none", cursor: "pointer"}}>+</h1>
            <img className="CardImage" src={"/favicon.svg"}/>
        </div>
        )
    }

    return (
        <div className="CardContainer" onClick={onClick}>

            <div className="CardButtons">
                <button className="CardButton">←</button>
                <button className="CardButton">✕</button>
            </div>
            <h1>{data.title}</h1>
            <img className="CardImage" src={data.imagePath || "/favicon.svg"}/>
            {!data.imagePath ? <button className="CardAddImage">
                <p className="ButtonAddImageLabel">Добавить изображение</p>
            </button> : ""}
        </div>
    )

}

export default Card