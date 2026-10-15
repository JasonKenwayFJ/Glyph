import {CreatorMode} from "../enums/creatorMode.ts";
import {EntityType} from "../enums/entityType.ts";

export type EntityContentProps = {
    invokeCreator: (mode: CreatorMode, type: EntityType, entity?: any) => void;
    searchText: string;
};