import {EntityType} from "../enums/entityType.ts";
import {Field} from "../entities/partials/field.ts";

export interface EntityDTO{
    entityType:EntityType,
    title:string,
    description: string,
    content: string,
    imagePath: string,
    categories: Field[],
    tags: Field[],
    extraFields: Field[]
}