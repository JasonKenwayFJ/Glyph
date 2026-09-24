import {EntityType} from "../enums/entityType.ts";
import {Source} from "../enums/source.ts";
import {Characteristic} from "./partials/characteristics.ts";
import {ExtraField} from "./partials/extraFields.ts";
import {BaseEntity} from "./baseEntity.ts";


export type Document = BaseEntity &{
    description: string;
    content: string;
    thumbnailSource: Source;
    thumbnail: string | null;
    entityType: EntityType;
    createdAt: string;
    updatedAt: string;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
    isPending: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
};