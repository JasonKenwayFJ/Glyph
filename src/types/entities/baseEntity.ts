import {EntityType} from "../enums/entityType.ts";
import {Source} from "./partials/source.ts";
import {Field} from "./partials/field.ts";
import {Priority} from "../enums/priority.ts";

export interface BaseEntity{
    id: string;
    title: string;
    description: string;
    entityType: EntityType;
    isPending: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;


}
export type UserEntity = {
    id: string,
    token: string,
    entityType: EntityType,
    username: string,
    email: string,
    imagePath: string,
    createdAt: Date,
    userConfig: string,
    isVerified: boolean,
    isSubscribed: boolean,
    subscriptionExpiresAt: Date,
}
export interface ProjectEntity extends BaseEntity{
    userId: string;
    weight: number;
}
export interface TaskEntity extends BaseEntity{
    parentTaskId: string | null;
    thumbnail: string | null;
    description: string;
    completedAt: string | null;
    priority: Priority;
    position: number;
    estimatedMinutes: number | null;
}
export type CardEntity = BaseEntity & {
    content: string;
    thumbnailSource: Source;
    thumbnail: string | null;
    projectId: string;
    userId: string;
    categories: Field[];
    tags: Field[];
    extraFields: Field[];

}
export type DocumentEntity = BaseEntity & {
    content: string;
    thumbnailSource: Source;
    thumbnail: string | null;
    projectId: string;
    userId: string;
    categories: Field[];
    tags: Field[];
    extraFields: Field[];

}