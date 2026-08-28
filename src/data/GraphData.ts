export type EntityGraph = {
    id: string;
    title: string;
    description: string;
};

export type GraphNode = {
    entityId: string;

    position: {
        x: number;
        y: number;
    };
};

export type Relation = {
    id: string;

    fromEntityId: string;
    toEntityId: string;

    type?: string;
};