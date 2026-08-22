// entityService.ts
import type { Table } from "dexie";
import type {baseCharacteristic, baseEntity, projectEntity} from "../../types/Entities.ts";
import { v4 as uuid } from "uuid";
import {uploadCardImage} from "./client.ts";
import type {LocalCharacteristic, LocalEntity, LocalProjects} from "./GlyphDB.ts";
import {isVerified} from "./Network/AuthorizationService.ts";



export function createProjectService(table: Table<LocalProjects, string>, api: {
    createProject: (entity: projectEntity) => Promise<{ message: string }>;
    updateProject: (entity: projectEntity) => Promise<{ message: string }>;
    removeProject: (id: string) => Promise<{ message: string }>
}) {
    return {
        async createLocally(data: Omit<LocalProjects, "id">): Promise<LocalProjects> {
            const newEntity: LocalProjects = { ...data, id: uuid() };
            let synced = false;

            if (await isVerified()) {
                try {
                    await api.createProject(newEntity);
                    synced = true;
                } catch (err) {
                    console.error("Sync failed, will retry later:", err);
                }
            }

            await table.add({
                ...newEntity,
                isSynced: synced,
                pendingAction: synced ? null : "create",
            });

            return newEntity;
        },

        async deleteLocally(id: string): Promise<void> {
            let synced = false;
            try {
                await api.removeProject(id);
                synced = true;
            } catch (err) {
                console.error("Sync failed, will retry later:", err);
            }

            if (synced) {
                await table.delete(id);
            } else {
                await table.update(id, { pendingAction: "delete", isSynced: false });
            }
        },

        async getAllLocally(): Promise<projectEntity[]> {
            return table.toArray();
        },

        async getUnsynced() {
            return table.filter((c) => !c.isSynced).toArray();
        },

        async syncPending(): Promise<void> {
            const unsynced = await this.getUnsynced();

            for (const item of unsynced) {
                try {
                    if (item.pendingAction === "create") {
                        await api.createProject(item);
                    } else if (item.pendingAction === "delete") {
                        await api.removeProject(item.id);
                        await table.delete(item.id);
                        continue;
                    }
                    await table.update(item.id, { isSynced: true, pendingAction: null });
                } catch (err) {
                    console.error(`Failed to sync ${item.id}:`, err);
                }
            }
        },

    };
}
export function createCharacteristicService(table: Table<LocalCharacteristic, string>, api: {
    createCharacteristic: (entity: baseCharacteristic) => Promise<{ message: string }>;
    removeCharacteristic: (id: string) => Promise<{ message: string }>
}) {
    return {
        async createLocally(data: Omit<LocalCharacteristic, "id">): Promise<LocalCharacteristic> {
            const newCharacteristic: LocalCharacteristic = { ...data, id: uuid() };
            let synced = false;

            if (await isVerified()) {
                try {
                    await api.createCharacteristic(newCharacteristic);
                    synced = true;
                } catch (err) {
                    console.error("Sync failed, will retry later:", err);
                }
            }

            await table.add({
                ...newCharacteristic,
                isSynced: synced,
                pendingAction: synced ? null : "create",
            });

            return newCharacteristic;
        },

        async deleteLocally(id: string): Promise<void> {
            let synced = false;
            try {
                await api.removeCharacteristic(id);
                synced = true;
            } catch (err) {
                console.error("Sync failed, will retry later:", err);
            }

            if (synced) {
                await table.delete(id);
            } else {
                await table.update(id, { pendingAction: "delete", isSynced: false });
            }
        },

        async getAllLocally(): Promise<baseCharacteristic[]> {
            return table.toArray();
        },

        async getUnsynced() {
            return table.filter((c) => !c.isSynced).toArray();
        },

        async syncPending(): Promise<void> {
            const unsynced = await this.getUnsynced();

            for (const item of unsynced) {
                try {
                    if (item.pendingAction === "create") {
                        await api.createCharacteristic(item);
                    } else if (item.pendingAction === "delete") {
                        await api.removeCharacteristic(item.id);
                        await table.delete(item.id);
                        continue;
                    }
                    await table.update(item.id, { isSynced: true, pendingAction: null });
                } catch (err) {
                    console.error(`Failed to sync ${item.id}:`, err);
                }
            }
        },

    };
}

export function createEntityService(table: Table<LocalEntity, string>, api: {
    create: (entity: baseEntity) => Promise<{ message: string }>;
    update: (entity: baseEntity) => Promise<{ message: string }>;
    remove: (id: string) => Promise<{ message: string }>
}) {
    return {
        async createLocally(data: Omit<baseEntity, "id">, imageFile?: File): Promise<baseEntity> {
            const newEntity: baseEntity = { ...data, id: uuid() };
            let synced = false;

            if (!imageFile && await isVerified()) {
                try {
                    await api.create(newEntity);
                    synced = true;
                } catch (err) {
                    console.error("Sync failed, will retry later:", err);
                }
            }

            await table.add({
                ...newEntity,
                isSynced: synced,
                pendingAction: synced ? null : "create",
                pendingImage: imageFile,
            });

            return newEntity;
        },

        async updateLocally(entity: baseEntity): Promise<baseEntity> {
            let synced = false;
            try {
                await api.update(entity);
                synced = true;
            } catch (err) {
                console.error("Sync failed, will retry later:", err);
            }

            const updated: LocalEntity = {
                ...entity,
                isSynced: synced,
                pendingAction: synced ? null : "update",
            };

            await table.update(entity.id, updated);
            return updated;
        },

        async deleteLocally(id: string): Promise<void> {
            let synced = false;
            try {
                await api.remove(id);
                synced = true;
            } catch (err) {
                console.error("Sync failed, will retry later:", err);
            }

            if (synced) {
                await table.delete(id);
            } else {
                await table.update(id, { pendingAction: "delete", isSynced: false });
            }
        },

        async getAllLocally(projectId?: string): Promise<baseEntity[]> {
            if (projectId) {
                return table.where("projectId").equals(projectId).toArray();
            }
            return table.toArray();
        },

        async getUnsynced() {
            return table.filter((c) => !c.isSynced).toArray();
        },

        async syncPending(): Promise<void> {
            const unsynced = await this.getUnsynced();

            for (const item of unsynced) {
                try {
                    if (item.pendingAction === "create") {
                        await api.create(item);
                    } else if (item.pendingAction === "update") {
                        await api.update(item);
                    } else if (item.pendingAction === "delete") {
                        await api.remove(item.id);
                        await table.delete(item.id);
                        continue;
                    }

                    if (item.pendingImage) {
                        const { imagePath } = await uploadCardImage(item.id, item.pendingImage);
                        await table.update(item.id, { imagePath, pendingImage: undefined, isSynced: true, pendingAction: null });
                    } else {
                        await table.update(item.id, { isSynced: true, pendingAction: null });
                    }
                } catch (err) {
                    console.error(`Failed to sync ${item.id}:`, err);
                }
            }
        }
    };
}