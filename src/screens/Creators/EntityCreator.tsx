import "./../MainStyles/Panels/EntityCreator.scss"
import { useEffect, useState } from "react";
import "../../index.scss";

import Category from "../../components/Shared/Category/Category.tsx";
import Tag from "../../components/Shared/Tag/Tag.tsx";
import Dropdown from "../../components/Shared/Dropdown/Dropdown.tsx";
import ImageUploader from "../../components/Shared/ImageUploader/ImageUploader.tsx";


import {
    Characteristic, CreatorMode,
    Entity,
    EntityType,
    ExtraField,
} from "../../types/Entities.ts";

import { invoke } from "@tauri-apps/api/core";
import { Project } from "../../types/Project.ts";


type EntityForm = {
    projectId: string;
    entityType: EntityType;
    title: string;
    description: string;
    content: string;
    imagePath: string;
    category: Characteristic[];
    tags: Characteristic[];
    extraFields: ExtraField[];
};


type CharacteristicItem = {
    id: string;
    title: string;
    isSelected: boolean;
};


type EntityCreatorProp<T> = {
    onClick: () => void;
    data?: T;
    mode?: CreatorMode;
    entityType?: EntityType
    onSaved?: (entity: Entity) => void;
    prefillContent?: string;
};


const EntityCreator = (props: EntityCreatorProp<Entity>) => {

    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        const getProject = async () => {
            try {
                const result = await invoke<Project | null>("get_project");
                setProject(result);
            } catch (error) {
                console.error("Error getting project:", error);
            }
        };

        getProject();
    }, []);


    /*
     * =========================
     * FORM
     * =========================
     */

    const [form, setForm] = useState<EntityForm>(() => ({
        projectId: props.data?.projectId ?? "",
        entityType: props.data?.entityType ?? EntityType.Card,
        title: props.data?.title ?? "",
        description: props.data?.description ?? "",
        content: props.data?.content ?? props.prefillContent ?? "",
        imagePath: props.data?.imagePath ?? "",
        category: props.data?.category ?? [],
        tags: props.data?.tags ?? [],
        extraFields: props.data?.extraFields ?? [],
    }));


    /*
     * project загружается ПОСЛЕ первого render,
     * поэтому projectId нельзя один раз получить
     * внутри useState.
     */

    useEffect(() => {
        if (!project) {
            return;
        }

        setForm(prev => ({
            ...prev,
            projectId: prev.projectId || project.id,
        }));
    }, [project]);


    /*
     * =========================
     * CATEGORIES / TAGS
     * =========================
     */

    const [selectedCategories, setSelectedCategories] =
        useState<CharacteristicItem[]>([]);

    const [categories, setCategories] =
        useState<CharacteristicItem[]>([]);

    const [selectedTags, setSelectedTags] =
        useState<CharacteristicItem[]>([]);

    const [tags, setTags] =
        useState<CharacteristicItem[]>([]);

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);


    /*
     * =========================
     * LOAD CATEGORIES / TAGS
     * =========================
     */



    /*
     * =========================
     * IMAGE
     * =========================
     */

    function imageHandler(value: File | undefined) {
        if (!value) {
            return;
        }

        setForm(prev => ({
            ...prev,
            imagePath: value.name,
        }));

        setPreviewUrl(URL.createObjectURL(value));
    }


    /*
     * =========================
     * ENTITY TYPE
     * =========================
     */

    function typeHandler(value: string | undefined) {
        if (!value) {
            return;
        }

        const entityType =
            value === "Документ"
                ? EntityType.Document
                : EntityType.Card;

        setForm(prev => ({
            ...prev,
            entityType,
        }));
    }


    /*
     * =========================
     * CATEGORY
     * =========================
     */

    function addCategoryHandler(category: CharacteristicItem) {
        setCategories(prev =>
            prev.filter(cat => cat.id !== category.id)
        );

        setSelectedCategories(prev => [
            ...prev,
            category,
        ]);
    }


    function removeCategoryHandler(category: CharacteristicItem) {
        setCategories(prev => [
            ...prev,
            category,
        ]);

        setSelectedCategories(prev =>
            prev.filter(cat => cat.id !== category.id)
        );
    }


    /*
     * =========================
     * TAG
     * =========================
     */

    function addTagHandler(tag: CharacteristicItem) {
        setTags(prev =>
            prev.filter(t => t.id !== tag.id)
        );

        setSelectedTags(prev => [
            ...prev,
            tag,
        ]);
    }


    function removeTagHandler(tag: CharacteristicItem) {
        setTags(prev => [
            ...prev,
            tag,
        ]);

        setSelectedTags(prev =>
            prev.filter(t => t.id !== tag.id)
        );
    }



    return (
        <div
            className="EntityCreatorOverlay"
            onClick={props.onClick}
        >
            <form
                className="EntityCreatorForm"
                onClick={e => e.stopPropagation()}
                onSubmit={() => {}}
            >

                <div className="EntityCreatorHeader">

                    {
                        props.data
                            ? <h2>Редактирование сущности</h2>
                            : <h2>Создание сущности</h2>
                    }

                    <div className="dropdown">

                        <Dropdown
                            getLabel="Тип: выбрать"
                            items={[
                                "Карточка",
                                "Документ",
                            ]}
                            onSelect={typeHandler}
                        />

                    </div>

                </div>


                <div className="EntityCreatorBody">

                    <div className="EntityCreatorBodyFooter">

                        <ImageUploader
                            imagePath={previewUrl}
                            onUpload={imageHandler}
                        />

                        <div className="EntityCreatorInputContainer">

                            <input
                                className="EntityCreatorInputTitle"
                                type="text"
                                placeholder="Название сущности"
                                value={form.title}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                            />

                            <div className="TagHandler">

                                {selectedTags.map(tag => (
                                    <Tag
                                        key={tag.id}
                                        id={tag.id}
                                        title={tag.title}
                                        onRemove={() =>
                                            removeTagHandler(tag)
                                        }
                                        isSelected={true}
                                    />
                                ))}

                            </div>

                        </div>

                    </div>


                    <div className="EntityCreatorField">

                        <p>Краткое описание</p>

                        <input
                            type="text"
                            placeholder="Пара строк для превью и карточки..."
                            value={form.description}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />

                    </div>


                    <div className="EntityCreatorField">

                        <p>Содержание</p>

                        <textarea
                            placeholder="Основной текст: Механика, лор, сценарий - Что угодно..."
                            value={form.content}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                        />

                    </div>


                    <div className="EntityCreatorField">

                        <p>Выберите категории</p>

                        <div className="EntityCreatorCategories">

                            {categories.map(category => (
                                <Category
                                    key={category.id}
                                    id={category.id}
                                    title={category.title}
                                    onAdd={() =>
                                        addCategoryHandler(category)
                                    }
                                    isSelected={false}
                                />
                            ))}

                        </div>

                    </div>


                    <div className="EntityCreatorField">

                        <p>Выберите тег</p>

                        <div className="EntityCreatorCategories">

                            {tags.map(tag => (
                                <Tag
                                    key={tag.id}
                                    id={tag.id}
                                    title={tag.title}
                                    onAdd={() =>
                                        addTagHandler(tag)
                                    }
                                    isSelected={false}
                                />
                            ))}

                        </div>

                    </div>


                    <div className="EntityCreatorExtraFields">

                        <div className="EntityCreatorExtraFieldsHeader">

                            <span>
                                Дополнительные поля
                            </span>

                            <button
                                type="button"
                                className="EntityCreatorExtraFieldAdd"
                                onClick={() =>
                                    setForm(prev => ({
                                        ...prev,
                                        extraFields: [
                                            ...prev.extraFields,
                                            {
                                                id: crypto.randomUUID(),
                                                title: "",
                                            },
                                        ],
                                    }))
                                }
                            >
                                + Добавить поле
                            </button>

                        </div>


                        {form.extraFields.map((field, index) => (

                            <div
                                className="EntityCreatorExtraFieldRow"
                                key={field.id}
                            >

                                <input
                                    placeholder="Название поля"
                                    value={field.title}
                                    onChange={e => {

                                        const updated =
                                            [...form.extraFields];

                                        updated[index] = {
                                            ...updated[index],
                                            title: e.target.value,
                                        };

                                        setForm(prev => ({
                                            ...prev,
                                            extraFields: updated,
                                        }));

                                    }}
                                />


                                <button
                                    type="button"
                                    className="EntityCreatorExtraFieldRemove"
                                    onClick={() =>
                                        setForm(prev => ({
                                            ...prev,
                                            extraFields:
                                                prev.extraFields.filter(
                                                    (_, idx) =>
                                                        idx !== index
                                                ),
                                        }))
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                        ))}

                    </div>


                    <div className="EntityCreatorButtonHandler">

                        <div className="EntitySelectedCategories">

                            {selectedCategories.map(category => (

                                <Category
                                    key={category.id}
                                    id={category.id}
                                    title={category.title}
                                    onRemove={() =>
                                        removeCategoryHandler(category)
                                    }
                                    isSelected={true}
                                />

                            ))}

                        </div>


                        <div>

                            <button
                                id="EntityCreatorButton"
                                type="submit"
                            >
                                {props.data
                                    ? "Сохранить"
                                    : "Создать"}
                            </button>

                            <button
                                className="EntityCreatorCancelButton"
                                type="button"
                                onClick={props.onClick}
                            >
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