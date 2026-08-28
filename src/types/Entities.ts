export enum EntityType {
    None = "None",
    Card = "Card",
    Document = "Document",
    Project = "Project",
    Note = "Note",
    Audio = "Audio",
    Video = "Video",
    Graph = "Graph",
    Table = "Table",
    List = "List",
    Task = "Task",
    Trash = "Trash"
}
export type User = {
    id: string,
    token: string,
    entityType: EntityType,
    username: string,
    email: string,
    imagePath: string,
    createdAt: Date,
    userConfig: string,
    isVerified: boolean,
    isSubscribed: boolean,
    subscriptionExpiresAt: Date,
}
export enum CreatorMode{
    None,
    Creating,
    Editing,
}

export interface Characteristic {
    id: string;
    title: string;
}

export interface ExtraField {
    id: string;
    title: string;
}

export type Entity = {
    id: string;
    projectId: string;
    title: string;
    description: string;
    content: string;
    imagePath: string;
    entityType: EntityType;
    createdAt: string;
    updatedAt: string;
    categories: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
}


