import {EntityType} from "../enums/entityType.ts";

export interface BaseEntity{
    id: string;
    title: string;
    projectId: string;
    userId: string;
    entityType: EntityType;
    isPending: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
}