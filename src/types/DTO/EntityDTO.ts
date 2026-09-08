import {Characteristic, EntityType, ExtraField} from "../Entities.ts";

export interface EntityDTO{
    entityType:EntityType,
    title:string,
    description: string,
    content: string,
    imagePath: string,
    categories: Characteristic[],
    tags: Characteristic[],
    extraFields: ExtraField[]
}