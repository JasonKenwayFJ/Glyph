import { Source } from "../enums/source.ts";
import { Characteristic } from "../entities/partials/characteristics.ts";
import { ExtraField } from "../entities/partials/extraFields.ts";

export type DocumentDto = {
    title: string;
    description: string;
    content: string;
    thumbnailSource: Source | null;
    thumbnail: string | null;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
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
    };
}