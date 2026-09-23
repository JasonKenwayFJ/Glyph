
import {EntityType} from "../enums/entityType.ts";
import {Characteristic} from "../entities/partials/characteristics.ts";
import {ExtraField} from "../entities/partials/extraFields.ts";
import {Source} from "../enums/source.ts";

export type DocumentDto = {
    title: string;
    description: string;
    content: string;
    thumbnailSource: Source;
    thumbnail: string | null;
    entityType: EntityType;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
    isPending: boolean;
}