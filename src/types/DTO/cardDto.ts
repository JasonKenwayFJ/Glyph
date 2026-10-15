import {Source} from "../entities/partials/source.ts";
import {EntityType} from "../enums/entityType.ts";
import {Field} from "../entities/partials/field.ts";

export type CardDto = {
    title: string;
    description: string;
    content: string;
    thumbnailSource: Source | null;
    thumbnail: string | null;
    entityType: EntityType;
    categories: Field[];
    tags: Field[];
    extraFields: Field[];
}
export function defaultCardDto(): CardDto {
    return {
        title: "",
        description: "",
        content: "",
        thumbnailSource: null,
        thumbnail: null,
        entityType: EntityType.Card,
        categories: [],
        tags: [],
        extraFields: []
    };
}

