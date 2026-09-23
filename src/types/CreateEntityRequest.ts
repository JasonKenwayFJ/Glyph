import {ProjectDto} from "./DTO/ProjectDTO.ts";
import {CardDto, DocumentDto, TaskDto} from "./DTO/cardDto.ts";

export type CreateEntityRequest =
    | ({ type: "Card" } & CardDto)
    | ({ type: "Project" } & ProjectDto)
    | ({type: "Document"} & DocumentDto)
    | ({ type: "Task" } & TaskDto);