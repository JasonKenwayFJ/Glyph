import {ExtraField} from "./partials/extraFields.ts";
import {Characteristic} from "./partials/characteristics.ts";import {Source} from "../enums/source.ts";
import {BaseEntity} from "./baseEntity.ts";

export type Card = BaseEntity & {
    description: string;
    content: string;
    thumbnailSource: Source;
    thumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
};