import "./../EntityPage/Styles/CardContent.scss"
import Card from "../Shared/Card/Card.tsx";
import {CreatorMode} from "../../../types/Entities.ts";
import {EntityPageContentProp} from "../../../types/LocalProps.ts";

export const CardContent = (props : EntityPageContentProp) => {

    return (
        <div className={"CardListContainer"}>
            <main className="EntityContent">
                <Card onClick={() => props.invokeCreator(CreatorMode.Creating)} />
                {props.filteredEntities.length === 0
                    ? props.entities.map((card) => (
                        <Card key={crypto.randomUUID()} data={card} onClick={() => props.invokeCreator(CreatorMode.Creating)} />
                    ))
                    : props.filteredEntities.map((card) => (
                        <Card key={crypto.randomUUID()} data={card} onClick={() => props.invokeCreator(CreatorMode.Creating)} />
                    ))}
            </main>
        </div>
    )
}