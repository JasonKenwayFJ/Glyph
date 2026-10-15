import "./CardStyle.scss"
import {CardEntity} from "../../types/entities/baseEntity.ts";

const DEFAULT_COVER = "/glyph-default-cover.svg";

type entityProp = {
    data?: CardEntity;
    onClick: () => void;
}
const Card = ({data, onClick} : entityProp) => {
    
    if (!data) {
        return (
            <div onClick={onClick} className="CardContainer">
            <h1 style={{fontSize: "3rem", textAlign: "center", userSelect: "none", cursor: "pointer"}}>+</h1>
            <img className="CardImage" src={DEFAULT_COVER} alt={""}/>
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
            <img
                className="CardImage"
                src={data.thumbnail?.trim() || DEFAULT_COVER}
                onError={(event) => {
                    const image = event.currentTarget;
                    image.onerror = null;
                    image.src = DEFAULT_COVER;
                }}
                alt={"Card Image"}
            />
            {!data.thumbnail ? <button className="CardAddImage">
                <p className="ButtonAddImageLabel">Добавить изображение</p>
            </button> : ""}
        </div>
    )

}

export default Card
