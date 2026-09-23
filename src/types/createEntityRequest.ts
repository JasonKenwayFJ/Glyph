import {ProjectDTO} from "./DTO/projectDTO.ts";
import {CardDto} from "./DTO/cardDto.ts";
import {DocumentDto} from "./DTO/documentDto.ts";
import {TaskDto} from "./DTO/taskDto.ts";
import {UserDto} from "./DTO/userDto.ts";
import {PluginDto} from "./DTO/PluginDto.ts";

export type CreateEntityRequest =
    | ({ type: "User" } & UserDto)
    | ({ type: "Project" } & ProjectDTO)
    | ({ type: "Plugin" } & PluginDto)
    | ({ type: "Card" } & CardDto)
    | ({ type: "Document" } & DocumentDto)
    | ({ type: "Task" } & TaskDto);