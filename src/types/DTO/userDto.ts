import {EntityType} from "../enums/entityType.ts";
import {Source} from "../entities/partials/source.ts";

export type UserDto ={
    userName: String,
    email: String,
    password: String,
    image_source: Source,
    thumbnail: string,
    entity_type: EntityType.User,
}