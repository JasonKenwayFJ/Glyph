import {Source} from "../enums/source.ts";
import {EntityType} from "../enums/entityType.ts";
import {Characteristic} from "../entities/partials/characteristics.ts";
import {ExtraField} from "../entities/partials/extraFields.ts";

export type CardDto = {
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

