import {BaseEntity} from "./baseEntity.ts";
import {EntityType} from "../enums/entityType.ts";

export type Task = BaseEntity &{
    parentTaskId: string | null;
    thumbnail: string | null;
    entityType: EntityType;
    description: string;

    status: TaskStatus;

    isPending: boolean;
    isDeleted: boolean;

    priority: Priority;
    position: number;
    estimatedMinutes: number | null;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    completedAt: string | null;
};

export enum Priority{
    Low,
    Medium,
    High,
    Critical
}
export enum TaskStatus{
    Todo,
    InProgress,
    Blocked,
    InReview,
    Done,
    Cancelled,
}