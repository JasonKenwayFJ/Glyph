import {Characteristic} from "../entities/partials/characteristics.ts";
import {ExtraField} from "../entities/partials/extraFields.ts";
import {EntityType} from "../enums/entityType.ts";

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