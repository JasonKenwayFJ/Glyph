import {CreatorMode, type Entity} from "./Entities.ts";

export type CharacteristicEntityCreator = {
    id?: string,
    title?: string,
    onRemove?: () => void,
    onAdd?: () => void,
    isSelected?: boolean
}

export type EntityPageContentProp = {
    invokeCreator: (mode: CreatorMode) => void;
    entities: Entity[];
    filteredEntities:Entity[];
}