import {ProjectDTO} from "./DTO/projectDTO.ts";
import {CardDto, defaultCardDto} from "./DTO/cardDto.ts";
import {defaultDocumentDto, DocumentDto} from "./DTO/documentDto.ts";
import {TaskDto} from "./DTO/taskDto.ts";
import {UserDto} from "./DTO/userDto.ts";
import {PluginDto} from "./DTO/PluginDto.ts";
import {EntityType} from "./enums/entityType.ts";
import {CardEntity, DocumentEntity, ProjectEntity, TaskEntity} from "./entities/baseEntity.ts";
import {User} from "./entities/user.ts";

export type CreateEntityRequest =
    | ({ type: "User" } & UserDto)
    | ({ type: "Project" } & ProjectDTO)
    | ({ type: "Plugin" } & PluginDto)
    | ({ type: "Card" } & CardDto)
    | ({ type: "Document" } & DocumentDto)
    | ({ type: "Task" } & TaskDto);

export type UpdateEntityRequest =
    | ({ type: "User" } & User)
    | ({ type: "Project" } & ProjectEntity)
    | ({ type: "Card" } & CardEntity)
    | ({ type: "Document" } & DocumentEntity)
    | ({ type: "Task" } & TaskEntity);
export function defaultRequest(entityType: EntityType): CreateEntityRequest {
    switch (entityType) {
        case EntityType.Document:
            return { type: "Document", ...defaultDocumentDto() };
        case EntityType.Card:
        default:
            return { type: "Card", ...defaultCardDto() };
    }
}

export function defaultUpdateRequest(entityType: EntityType, data: any): UpdateEntityRequest {
    switch (entityType) {
        case EntityType.Document:
            return { type: "Document", ...data };
        case EntityType.Card:
        default:
            return { type: "Card", ...data };
    }
}