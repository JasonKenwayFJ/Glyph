import {ProjectDTO} from "./DTO/projectDTO.ts";
import {CardDto, defaultCardDto} from "./DTO/cardDto.ts";
import {defaultDocumentDto, DocumentDto} from "./DTO/documentDto.ts";
import {TaskDto} from "./DTO/taskDto.ts";
import {UserDto} from "./DTO/userDto.ts";
import {PluginDto} from "./DTO/PluginDto.ts";
import {EntityType} from "./enums/entityType.ts";

export type CreateEntityRequest =
    | ({ type: "User" } & UserDto)
    | ({ type: "Project" } & ProjectDTO)
    | ({ type: "Plugin" } & PluginDto)
    | ({ type: "Card" } & CardDto)
    | ({ type: "Document" } & DocumentDto)
    | ({ type: "Task" } & TaskDto);

export function defaultRequest(entityType: EntityType): CreateEntityRequest {
    switch (entityType) {
        case EntityType.Document:
            return { type: "Document", ...defaultDocumentDto() };
        case EntityType.Card:
        default:
            return { type: "Card", ...defaultCardDto() };
    }
}