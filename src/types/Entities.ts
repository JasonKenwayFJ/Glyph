export enum EntityType {
    Card = "Card",
    Document = "Document",
    Project = "Project"
}

export interface Characteristic {
    id: string;
    title: string;
}

export interface ExtraField {
    id: string;
    title: string;
}

export interface Entity {
    id: string;
    projectId: string;
    title: string;
    description: string;
    content: string;
    imagePath: string;
    entityType: EntityType;
    createdAt: string;
    updatedAt: string;
    category: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
}


