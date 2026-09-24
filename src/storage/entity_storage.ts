import { create } from 'zustand';
import { listen } from '@tauri-apps/api/event';
import { BaseEntity } from '../types/entities/baseEntity.ts';
import { EntityType } from '../types/enums/entityType.ts';

type EntityStorage = {
    entities: BaseEntity[];

    setEntities: (entities: BaseEntity[]) => void;
    getEntities: (entityType: EntityType) => BaseEntity[];

    addEntity: (entity: BaseEntity) => void;
    updateEntity: (entity: BaseEntity) => void;
    removeEntity: (entityId: string) => void;
};

export const useEntityStorage = create<EntityStorage>((set, get) => {
    void listen<BaseEntity[]>("OnEntitiesLoaded", (event) => {
        set({ entities: event.payload });
    }).catch((error) => console.error("Не удалось подписаться на OnEntitiesLoaded:", error));

    void listen<BaseEntity>("OnEntityCreated", (event) => {
        set((state) => ({ entities: [...state.entities, event.payload] }));
    }).catch((error) => console.error("Не удалось подписаться на OnEntityCreated:", error));

    void listen<BaseEntity>("OnEntityUpdated", (event) => {
        set((state) => ({
            entities: state.entities.map((e) => (e.id === event.payload.id ? event.payload : e)),
        }));
    }).catch((error) => console.error("Не удалось подписаться на OnEntityUpdated:", error));

    void listen<BaseEntity>("OnEntityMovedToTrash", (event) => {
        set((state) => ({
            entities: state.entities.filter((e) => e.id !== event.payload.id),
        }));
    }).catch((error) => console.error("Не удалось подписаться на OnEntityMovedToTrash:", error));

    return {
        entities: [],

        setEntities: (entities) => set({ entities }),

        getEntities: (entityType) => get().entities.filter((e) => e.entityType === entityType),

        addEntity: (entity) => set((state) => ({ entities: [...state.entities, entity] })),

        updateEntity: (entity) =>
            set((state) => ({
                entities: state.entities.map((e) => (e.id === entity.id ? entity : e)),
            })),

        removeEntity: (entityId) =>
            set((state) => ({
                entities: state.entities.filter((e) => e.id !== entityId),
            })),
    };
});