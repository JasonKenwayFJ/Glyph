import {Source} from "../enums/source.ts";

export type ProjectDTO = {
    title: string;
    description: string;
    imageSource: Source | null;
    thumbnail: string | null;
};
