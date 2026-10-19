import {CardEntity} from "../../../../types/entities/baseEntity.ts";
import {CardDto} from "../../../../types/DTO/cardDto.ts";
import ImageUploader from "../../../../components/Shared/ImageUploader/ImageUploader.tsx";
import {EntityType} from "../../../../types/enums/entityType.ts";

type CardCreatorProps = {
    value?: CardEntity | CardDto;
    onChange: (patch: Partial<CardDto>) => void;
    entityType: EntityType
}
export const CardCreator = (props : CardCreatorProps) => {


    return (
        <>
            <div className="EntityCreatorBodyFooter">
                <ImageUploader
                    imagePath={props.value?.thumbnail}
                    onUpload={(file) =>
                        props.onChange({
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
                        value={props.value?.title}
                        onChange={(e) => props.onChange({ title: e.target.value })}
                    />
                    <div className="TagHandler">
                        {/* теги — подключим, когда решим Category/Tag компоненты */}
                    </div>
                </div>
            </div>

            <div className="EntityCreatorField">
                <p>Краткое описание</p>
                <input
                    type="text"
                    required
                    placeholder="Пара строк для превью и карточки..."
                    value={props.value?.description}
                    onChange={(e) => props.onChange({ description: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Содержание</p>
                <textarea
                    placeholder="Основной текст: механика, лор, сценарий — что угодно..."
                    value={props.value?.content}
                    required
                    onChange={(e) => props.onChange({ content: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Выберите категории</p>
                <div className="EntityCreatorCategories">
                    {/* categories — подключим позже */}
                </div>
            </div>

            <div className="EntityCreatorField">
                <p>Выберите тег</p>
                <div className="EntityCreatorCategories">
                    {/* tags — подключим позже */}
                </div>
            </div>

            <div className="EntityCreatorExtraFields">
                <div className="EntityCreatorExtraFieldsHeader">
                    <span>Дополнительные поля</span>
                    <button
                        type="button"
                        className="EntityCreatorExtraFieldAdd"
                        onClick={() =>
                            props.onChange({
                                extraFields: [
                                    ...props.value!.extraFields,
                                    { id: crypto.randomUUID(), title: "", type: PartialType.ExtraField },
                                ],
                            })
                        }
                    >
                        + Добавить поле
                    </button>
                </div>

                {props.value!.extraFields.map((field, index) => (
                    <div className="EntityCreatorExtraFieldRow" key={field.id}>
                        <input
                            required
                            placeholder="Название поля"
                            value={field.title}
                            onChange={(e) => {
                                const updated = [...props.value!.extraFields];
                                updated[index] = { ...updated[index], title: e.target.value };
                                props.onChange({ extraFields: updated });
                            }}
                        />
                        <button
                            type="button"
                            className="EntityCreatorExtraFieldRemove"
                            onClick={() =>
                                props.onChange({
                                    extraFields: props.value!.extraFields.filter((_, idx) => idx !== index),
                                })
                            }
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}