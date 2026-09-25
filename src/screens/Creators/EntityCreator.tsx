import "./../MainStyles/Panels/EntityCreator.scss";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Dropdown from "../../components/Shared/Dropdown/Dropdown.tsx";
import { CreatorMode } from "../../types/enums/creatorMode.ts";
import { EntityType } from "../../types/enums/entityType.ts";
import { BaseEntity } from "../../types/entities/baseEntity.ts";
import {CreateEntityRequest, defaultRequest} from "../../types/createEntityRequest.ts";
import {CardCreator} from "./entityCreatorPage/CardCreator.tsx";
import {DocumentCreator} from "./entityCreatorPage/DocumentCreator.tsx";
import {createEntity} from "../../apis/entityApi.ts";


type EntityCreatorProps = {
    entityType: EntityType;
    mode?: CreatorMode;
    data?: BaseEntity;
    onClose: () => void;
    onSaved: () => void;
};

const EntityCreator = (props: EntityCreatorProps) => {
    const [isLoading, setLoading] = useState(false);

    const [form, setForm] = useState<CreateEntityRequest>(() =>
        props.data
            ? ({ type: props.data.entityType, ...props.data } as CreateEntityRequest)
            : defaultRequest(props.entityType)
    );

    function patch(update: Partial<CreateEntityRequest>) {
        setForm((prev) => ({ ...prev, ...update }) as CreateEntityRequest);
    }

    function changeType(label: string | undefined) {
        const type = label === "Документ" ? EntityType.Document : EntityType.Card;
        setForm(defaultRequest(type));
    }

    async function submit() {
        setLoading(true);
        try {
            await invoke<BaseEntity>("create_entity", { data: form });
            props.onSaved();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="EntityCreatorOverlay" onClick={props.onClose}>
            {isLoading && <div>Загрузка</div>}
            <form
                className="EntityCreatorForm"
                onClick={(e) => e.stopPropagation()}
                onSubmit={async (e) => {
                    e.preventDefault();
                    await submit();
                }}
            >
                <div className="EntityCreatorHeader">
                    <h2>{props.data ? "Редактирование сущности" : "Создание сущности"}</h2>
                    <div className="dropdown">
                        <Dropdown getLabel="Тип: выбрать" items={["Карточка", "Документ"]} onSelect={changeType} />
                    </div>
                </div>

                <div className="EntityCreatorBody">
                    {form.type === "Card" && <CardCreator value={form} onChange={patch} />}
                    {form.type === "Document" && <DocumentCreator value={form} onChange={patch} />}

                    <div className="EntityCreatorButtonHandler">
                        <div>
                            <button id="EntityCreatorButton" type="submit">
                                {props.data ? "Сохранить" : "Создать"}
                            </button>
                            <button className="EntityCreatorCancelButton" type="button" onClick={props.onClose}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EntityCreator;