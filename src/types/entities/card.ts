import {ExtraField} from "./partials/extraFields.ts";
import {Characteristic} from "./partials/characteristics.ts";
import {EntityType} from "../enums/entityType.ts";
import {Source} from "../enums/source.ts";

export type Card = {
    id: string;
    projectId: string;
    userId: string;
    title: string;
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