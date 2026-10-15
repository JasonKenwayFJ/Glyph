import "./Styles/CardContent.scss";
import {useMemo} from "react";
import {useEntityStorage} from "../../../../storage/entity_storage.ts";
import {EntityType} from "../../../../types/enums/entityType.ts";
import {CreatorMode} from "../../../../types/enums/creatorMode.ts";
import Card from "../../../../templates/Card/Card.tsx";
import {EntityContentProps} from "../../../../types/props/EntityContentProps.ts";
import {CardEntity} from "../../../../types/entities/baseEntity.ts";



export const CardContent = ({invokeCreator, searchText}: EntityContentProps) => {
    const entities = useEntityStorage((state) => state.entities);
    let cards = useMemo(() => entities.filter((e) => e.entityType === EntityType.Card), [entities]);

    
    const filtered = searchText
        ? cards.filter((c) => c.title.toLowerCase().includes(searchText.toLowerCase()))
        : cards;

    return (
        <div className={"CardListContainer"}>
            <main className="EntityContent">
                <Card onClick={() => invokeCreator(CreatorMode.Creating, EntityType.Card)}/>
                {filtered.map((card) => (
                    <Card key={card.id} data={card as CardEntity} onClick={() => invokeCreator(CreatorMode.Creating, EntityType.Card, card)}/>
                ))}
            </main>
        </div>
    );
};