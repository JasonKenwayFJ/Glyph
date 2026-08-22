import Dexie, { type Table } from "dexie";
import type {baseCharacteristic, baseEntity, projectEntity} from "../../types/Entities.ts";

// расширяем тип — добавляем служебное поле синхронизации
export type LocalEntity = baseEntity & {
    isSynced: boolean;
    pendingAction: "create" | "update" | "delete" | null;
    pendingImage?: File;
};

export type LocalCharacteristic = baseCharacteristic & {
    isSynced: boolean;
    pendingAction: "create" | "update" | "delete" | null;
};

export type LocalProjects = projectEntity & {
    isSynced: boolean;
    pendingAction: "create" | "update" | "delete" | null;
}



class GlyphDB extends Dexie {
    projects!: Table<LocalProjects, string>;

    cards!: Table<LocalEntity, string>;
    documents!: Table<LocalEntity, string>;
    locations!: Table<LocalEntity, string>;

    categories!: Table<LocalCharacteristic, string>;
    tags!: Table<LocalCharacteristic, string>;

    constructor() {
        super("GlyphLocalDB");
        this.version(1).stores({
            projects: "id, isSynced",

            cards: "id, projectId, isSynced",
            documents: "id, projectId, isSynced",
            locations: "id, projectId, isSynced",

            categories: "id, isSynced",
            tags: "id, isSynced",
        });
    }
}

export const db = new GlyphDB();