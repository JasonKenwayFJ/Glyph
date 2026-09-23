import {ProjectDTO} from "./DTO/projectDTO.ts";
import {CardDto} from "./DTO/cardDto.ts";
import {DocumentDto} from "./DTO/documentDto.ts";
import {TaskDto} from "./DTO/taskDto.ts";
import {UserDto} from "./DTO/userDto.ts";

export type CreateEntityRequest =
    | ({ type: "User" } & UserDto)
    | ({ type: "Project" } & ProjectDTO)
    | ({ type: "Card" } & CardDto)
    | ({ type: "Document" } & DocumentDto)
    | ({ type: "Task" } & TaskDto);