import {EntityType} from "../enums/entityType.ts";
import {Priority} from "../entities/task.ts";

export type TaskDto = {
    id: string;
    parentTaskId: string | null;
    thumbnail: string | null;
    entityType: EntityType;
    title: string;
    description: string;
    priority: Priority;
};