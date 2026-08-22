import "./EntityCreator.css"
import {useEffect, useState} from "react";
import "../../../index.css"
import Category from "../../../components/Shared/Category/Category.tsx";
import {categoryService} from "../../../services/entityServices/categoryService.ts";
import {tagService} from "../../../services/entityServices/tagService.ts";
import Tag from "../../../components/Shared/Tag/Tag.tsx";
import type {baseCharacteristic, baseEntity} from "../../../../types/Entities.ts";
import Dropdown from "../../../components/Shared/Dropdown/Dropdown.tsx";
import {cardsService} from "../../../services/entityServices/cardsService.ts";
import {documentsService} from "../../../services/entityServices/documentService.ts";
import ImageUploader from "../../../components/Shared/ImageUploader/ImageUploader.tsx";
import {useProject} from "../../../app/ProjectContext.tsx";

type EntityForm = {
    projectId: string,
    type: string,
    title: string,
    description: string,
    content: string,
    image: File,
    category: baseCharacteristic[],
    tags: baseCharacteristic[],
    hasImage: boolean,
    extraFields: { title: string, value: string }[]
}

type characteristicItem = {
    id: string,
    title: string
    isSelected: boolean
}

type EntityCreatorProp<T> = {
    onClick: () => void;
    data?: T;
    mode: string;
    onSaved?: (entity: baseEntity) => void;
    prefillContent?: string;
}
const EntityCreator = (props: EntityCreatorProp<baseEntity>) => {
    const {project} = useProject()
    const [form, setForm] = useState<EntityForm>(() => ({
        projectId: props.data?.projectId ?? "",
        type: "",
        title: props.data?.title ?? "",
        description: props.data?.description ?? "",
        content: props.data?.content ?? props.prefillContent ?? "", // ← вот тут
        image: new File([], ""),
        category: [],
        tags: [],
        hasImage: props.data?.hasImage ?? false,
        extraFields: props.data?.extraFields ?? []
    }));


    const [selectedCategories, setSelectedCategories] = useState<characteristicItem[]>([]);
    const [categories, setCategories] = useState<characteristicItem[]>([]);
    const [selectedTags, setSelectedTags] = useState<characteristicItem[]>([]);
    const [tags, setTags] = useState<characteristicItem[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const cats = await categoryService.getAllLocally()
                setCategories(cats.map((cat) => ({id: cat.id, title: cat.title, isSelected: false})));
                const docs = await tagService.getAllLocally()
                setTags(docs.map((t) => ({id: t.id, title: t.title, isSelected: false})))
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        }

        load();
    }, []);



    function imageHandler(value: File | undefined) {
        if (value) {
            setForm({
                ...form,
                image: value,
                hasImage: true
            });
            setPreviewUrl(URL.createObjectURL(value));
        }
    }

    function typeHandler(value: string | undefined) {
        if (value) {
            setForm({
                ...form,
                type: value
            })
        }
    }

    function addCategoryHandler(category: characteristicItem) {
        setCategories(categories.filter((cat) => cat.id !== category.id))
        setSelectedCategories([...selectedCategories, category])
    }

    function addTagHandler(tag: characteristicItem) {
        setTags(tags.filter((t) => t.id !== tag.id))
        setSelectedTags([...selectedTags, tag])
    }

    function removeCategoryHandler(category: characteristicItem) {
        setCategories([...categories, category])
        setSelectedCategories(selectedCategories.filter((cat) => cat.id !== category.id))
    }

    function removeTagHandler(tag: characteristicItem) {
        setTags([...tags, tag])
        setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
    }

    return (
        <div className="EntityCreatorOverlay" onClick={props.onClick}>
            <form
                className="EntityCreatorForm"
                onClick={(e) => e.stopPropagation()}
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (!project!.id) {
                        console.error("No project selected");
                        return;
                    }
                    const payload: Omit<baseEntity, "id"> = {
                        projectId: form.projectId? form.projectId : project!.id!,
                        title: form.title,
                        description: form.description,
                        content: form.content,
                        imagePath: props.data?.imagePath ?? "", // реальный путь появится после загрузки файла на сервер
                        category: selectedCategories.map(c => ({id: c.id, title: c.title})),
                        tags: selectedTags.map(t => ({id: t.id, title: t.title})),
                        hasImage: form.hasImage,
                        createdAt: props.data?.createdAt ?? new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        extraFields: form.extraFields,
                    };

                    try {
                        let saved: baseEntity;

                        if (props.mode === "cards") {
                            saved = props.data
                                ? await cardsService.updateLocally({ ...props.data, ...payload })
                                : await cardsService.createLocally(payload);
                        } else if (props.mode === "documents") {
                            saved = props.data
                                ? await documentsService.updateLocally({ ...props.data, ...payload })
                                : await documentsService.createLocally(payload);
                        } else {
                            throw new Error(`Unknown mode: ${props.mode}`);
                        }

                        if (props.onSaved)
                            props.onSaved(saved);
                        props.onClick();

                    } catch (e) {
                        console.error("Error saving entity:", e);
                    }
                }
                }
            >
                <div className="EntityCreatorHeader">

                    {props.data ? <h2>Редактирование сущности</h2> : <h2>Создание сущности</h2>}
                    <div className="dropdown">
                        <Dropdown
                            getLabel="Тип: выбрать"
                            items={["Персонаж", "Локация", "Предмет"]}
                            onSelect={(item) => {
                                typeHandler(item);
                            }}
                        />
                    </div>

                </div>


                <div className="EntityCreatorBody">

                    <div className="EntityCreatorBodyFooter">

                        <ImageUploader imagePath={previewUrl} onUpload={imageHandler}/>


                        <div className="EntityCreatorInputContainer">
                            <input
                                className="EntityCreatorInputTitle"
                                type="text"
                                placeholder="Название сущности"
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value})}
                            />
                            <div className="TagHandler">
                                {selectedTags.map((t) => (
                                    <Tag
                                        key={t.id}
                                        id={t.id}
                                        title={t.title}
                                        onRemove={() => removeTagHandler(t)}
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
                            onChange={(e) => setForm({...form, description: e.target.value})}/>
                    </div>


                    <div className="EntityCreatorField">
                        <p>Содержание</p>
                        <textarea
                            placeholder="Основной текст: Механика, лор, сценарий - Что угодно..."
                            value={form.content}
                            onChange={(e) => setForm({...form, content: e.target.value})}/>
                    </div>


                    <div className="EntityCreatorField">
                        <p>Выберите категории</p>
                        <div className="EntityCreatorCategories">
                            {categories.map((cat) => (
                                <Category
                                    key={cat.id}
                                    id={cat.id}
                                    title={cat.title}
                                    onAdd={() => addCategoryHandler(cat)}
                                    isSelected={false}/>
                            ))}
                        </div>

                    </div>
                    <div className="EntityCreatorField">
                        <p>Выберите тег</p>
                        <div className="EntityCreatorCategories">
                            {tags.map((tag) => (
                                <Tag
                                    key={tag.id}
                                    id={tag.id}
                                    title={tag.title}
                                    onAdd={() => addTagHandler(tag)}
                                    isSelected={false}/>
                            ))}
                        </div>

                    </div>


                    <div className="EntityCreatorExtraFields">
                        <div className="EntityCreatorExtraFieldsHeader">
                            <span>Дополнительные поля</span>
                            <button
                                type="button"
                                className="EntityCreatorExtraFieldAdd"
                                onClick={() => setForm({
                                    ...form,
                                    extraFields: [...form.extraFields, {title: "", value: ""}]
                                })}
                            >
                                + Добавить поле
                            </button>
                        </div>

                        {form.extraFields.map((field, i) => (
                            <div className="EntityCreatorExtraFieldRow" key={i}>
                                <input
                                    placeholder="Название поля"
                                    value={field.title}
                                    onChange={(e) => {
                                        const updated = [...form.extraFields];
                                        updated[i] = {...updated[i], title: e.target.value};
                                        setForm({...form, extraFields: updated});
                                    }}
                                />
                                <input
                                    placeholder="Значение"
                                    value={field.value}
                                    onChange={(e) => {
                                        const updated = [...form.extraFields];
                                        updated[i] = {...updated[i], value: e.target.value};
                                        setForm({...form, extraFields: updated});
                                    }}
                                />
                                <button
                                    type="button"
                                    className="EntityCreatorExtraFieldRemove"
                                    onClick={() => setForm({
                                        ...form,
                                        extraFields: form.extraFields.filter((_, idx) => idx !== i)
                                    })}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="EntityCreatorButtonHandler">
                        <div className="EntitySelectedCategories">
                            {selectedCategories.map((cat) => (
                                <Category key={cat.id} id={cat.id} title={cat.title}
                                          onRemove={() => removeCategoryHandler(cat)} isSelected={true}/>
                            ))}

                        </div>
                        <div>
                            <button id="EntityCreatorButton" type="submit">Создать</button>
                            <button className="EntityCreatorCancelButton" type="button" onClick={props.onClick}>Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
        ;
};

export default EntityCreator;