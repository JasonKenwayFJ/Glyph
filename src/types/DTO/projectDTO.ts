import {Source} from "../entities/partials/source.ts";

export type ProjectDTO = {
    title: string;
    description: string;
    imageSource: Source | null;
    thumbnail: string | null;
};
