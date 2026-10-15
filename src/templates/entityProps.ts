import {BaseEntity} from "../types/entities/baseEntity.ts";

export type entityProp = {
    data?: BaseEntity;
    onClick: () => void;
}