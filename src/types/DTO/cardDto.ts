import {Source} from "../enums/source.ts";
import {EntityType} from "../enums/entityType.ts";
import {Characteristic} from "../entities/partials/characteristics.ts";
import {ExtraField} from "../entities/partials/extraFields.ts";

export type CardDto = {
    title: string;
    description: string;
    content: string;
    thumbnailSource: Source | null;
    thumbnail: string | null;
    entityType: EntityType;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
}
export function defaultCardDto(): CardDto {
    return {
        entityType: EntityType.Card,
        title: "",
        description: "",
        content: "",
        thumbnailSource: "None",
        thumbnail: null,
        categories: [],
        tags: [],
        extraFields: []
    };
}

