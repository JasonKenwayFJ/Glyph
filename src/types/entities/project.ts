import {EntityType} from "../enums/entityType.ts";

export interface Project {
    id: string;
    userId: string,
    title: string;
    entityType: EntityType
    description: string;
    imagePath: string;
    createdAt: string;
    updatedAt: string;
    weight: number;
    isPending: boolean;
}