import {DocumentDto} from "../../../../../types/DTO/documentDto.ts";
import ImageUploader from "../../../../../components/Shared/ImageUploader/ImageUploader.tsx";
import {useState} from "react";
import {FieldElement} from "../../../../components/Shared/Field/Field.tsx";
import {Field} from "../../../../../types/entities/partials/field.ts";


type DocumentCreatorProps = {
    value: DocumentDto;
    onChange: (patch: Partial<DocumentDto>) => void;
};

export const DocumentCreator = ({ value, onChange }: DocumentCreatorProps) => {

    const [_fields, _setFields] = useState<Field[]>(value.extraFields);

    return (
        <div className={"CreatorContainer"}>
            <div className="EntityCreatorBodyFooter">
                <ImageUploader
                    imagePath={value.thumbnail}
                    onUpload={(file) =>
                        onChange({
                            thumbnail: file?.name ?? null,
                            thumbnailSource: file ? { File: file.name } : null,
                        })
                    }
                />

                <div className="EntityCreatorInputContainer">
                    <input
                        className="EntityCreatorInputTitle"
                        type="text"
                        placeholder="Название сущности"
                        value={value.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                    />
                    <div className="TagHandler">
                        <FieldElement key={"asd"} fieldName={"Название тега"} />
                    </div>
                </div>
            </div>

            <div className="EntityCreatorField">
                <p>Краткое описание</p>
                <input
                    type="text"
                    required
                    placeholder="Пара строк для превью и карточки..."
                    value={value.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Содержание</p>
                <textarea
                    placeholder="Основной текст: механика, лор, сценарий — что угодно..."
                    value={value.content}
                    required
                    onChange={(e) => onChange({ content: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Выберите категории</p>
                <div className="EntityCreatorCategories">
                    <FieldElement key={"asd"} fieldName={"Лор"} />
                </div>
            </div>

            <div className="EntityCreatorField">
                <p>Выберите тег</p>
                <div className="EntityCreatorCategories">
                    <FieldElement key={"asd"} fieldName={"Механика"} />
                </div>
            </div>

            <div className="EntityCreatorExtraFields">
                <div className="EntityCreatorExtraFieldsHeader">
                    <span>Дополнительные поля</span>
                    <button
                        type="button"
                        className="EntityCreatorExtraFieldAdd"
                        onClick={() =>
                            onChange({
                                extraFields: [
                                    ...value.extraFields,
                                    { id: crypto.randomUUID(), title: "", type: PartialType.ExtraField },
                                ],
                            })
                        }
                    >
                        + Добавить поле
                    </button>
                </div>

                {value.extraFields.map((field, index) => (
                    <div className="EntityCreatorExtraFieldRow" key={field.id}>
                        <input
                            required
                            placeholder="Название поля"
                            value={field.title}
                            onChange={(e) => {
                                const updated = [...value.extraFields];
                                updated[index] = { ...updated[index], title: e.target.value };
                                onChange({ extraFields: updated });
                            }}
                        />
                        <button
                            type="button"
                            className="EntityCreatorExtraFieldRemove"
                            onClick={() =>
                                onChange({
                                    extraFields: value.extraFields.filter((_, idx) => idx !== index),
                                })
                            }
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};