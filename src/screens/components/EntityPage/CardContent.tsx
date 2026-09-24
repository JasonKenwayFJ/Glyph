import "./../EntityPage/Styles/CardContent.scss";
import Card from "../Shared/Card/Card.tsx";
import { CreatorMode } from "../../../types/enums/creatorMode.ts";
import { EntityType } from "../../../types/enums/entityType.ts";
import { useEntityStorage } from "../../../storage/entity_storage.ts";

type CardContentProps = {
    invokeCreator: (mode: CreatorMode, entity?: any) => void;
    searchText: string;
};

export const CardContent = ({ invokeCreator, searchText }: CardContentProps) => {
    const cards = useEntityStorage((state) => state.getEntities(EntityType.Card));

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