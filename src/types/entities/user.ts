import {EntityType} from "../Entities.ts";

export type User = {
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