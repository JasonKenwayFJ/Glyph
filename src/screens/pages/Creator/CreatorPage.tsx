import {useState} from "react";
import {CreateEntityRequest} from "../../../types/createEntityRequest.ts";
import {BaseEntity} from "../../../types/entities/baseEntity.ts";
import {EntityType} from "../../../types/enums/entityType.ts";
import {CreatorMode} from "../../../types/enums/creatorMode.ts";
import {CardCreator} from "./Contents/CardCreator.tsx";

type EntityCreatorProps = {
    entityType: EntityType;
    mode?: CreatorMode;
    data?: any;
    prefillContent?: string;
    onClose: () => void;
    onSaved: () => void;
};
export const CreatorPage = (props : EntityCreatorProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState<CreateEntityRequest | BaseEntity>(
        props.data
        ? ({ type: props.data.entityType, ...props.data } as any as CreateEntityRequest)
        : { type: props.entityType, ...props } as any as BaseEntity
    );

    async function create() {
        console.log("Creating entity", form);
    }
    async function update(){
        console.log("Updating entity", form);
    }

    return (
        <div>
            {props.data && props.mode == CreatorMode.Creating && <CardCreator entityType={props.entityType} onChange={setForm}/>}
        </div>
    )
}