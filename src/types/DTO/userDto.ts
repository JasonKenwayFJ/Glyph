import {EntityType} from "../enums/entityType.ts";
import {Source} from "../enums/source.ts";

export type UserDto ={
    userName: String,
    email: String,
    password: String,
    image_source: Source,
    thumbnail: string,
    entity_type: EntityType.User,
}