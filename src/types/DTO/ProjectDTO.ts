import {Source} from "../enums/source.ts";

export type ProjectDto = {
    title: string;
    description: string;
    imageSource: Source | null;
    thumbnail: string | null;
};
