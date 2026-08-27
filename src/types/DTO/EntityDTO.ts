import {Characteristic, EntityType, ExtraField} from "../Entities.ts";

export interface EntityDTO{
    projectId: string,
    entityType:EntityType,
    title:string,
    description: string,
    content: string,
    imagePath: string,
    categories: Characteristic[],
    tags: Characteristic[],
    extraFields: ExtraField[]
}