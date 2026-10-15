import { Source } from "../entities/partials/source.ts";
import {Field} from "../entities/partials/field.ts";
import {EntityType} from "../enums/entityType.ts";

export type DocumentDto = {
    title: string;
    description: string;
    content: string;
    thumbnailSource: Source | null;
    thumbnail: string | null;
    entityType: EntityType;
    categories: Field[];
    tags: Field[];
    extraFields: Field[];
};

export function defaultDocumentDto(): DocumentDto {
    return {
        title: "",
        description: "",
        content: "",
        thumbnailSource: null,
        thumbnail: null,
        categories: [],
        tags: [],
        extraFields: [],
        entityType: EntityType.Document,
    };
}