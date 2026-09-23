import {EntityType} from "../Entities.ts";

export type Task = {
    id: string;
    userId: string;
    projectId: string;
    parentTaskId: string | null;
    thumbnail: string | null;
    entityType: EntityType;
    title: string;
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