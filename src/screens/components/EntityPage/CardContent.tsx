import "./../EntityPage/Styles/CardContent.scss";
import Card from "../Shared/Card/Card.tsx";
import {CreatorMode} from "../../../types/enums/creatorMode.ts";
import {EntityType} from "../../../types/enums/entityType.ts";
import {useEntityStorage} from "../../../storage/entity_storage.ts";
import {useMemo} from "react";

export type EntityContentProps = {
    invokeCreator: (mode: CreatorMode, entity?: any) => void;
    searchText: string;
};

export const CardContent = ({ invokeCreator, searchText }: EntityContentProps) => {
    const entities = useEntityStorage((state) => state.entities);
    const cards = useMemo(() => entities.filter((e) => e.entityType === EntityType.Card), [entities]);

    const filtered = searchText
        ? cards.filter((c) => c.title.toLowerCase().includes(searchText.toLowerCase()))
        : cards;

    return (
        <div className={"CardListContainer"}>
            <main className="EntityContent">
                <Card onClick={() => invokeCreator(CreatorMode.Creating)} />
                {filtered.map((card) => (
                    <Card key={card.id} data={card} onClick={() => invokeCreator(CreatorMode.Creating, card)} />
                ))}
            </main>
        </div>
    );
};