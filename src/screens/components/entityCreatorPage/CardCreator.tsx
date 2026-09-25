import ImageUploader from "../../../components/Shared/ImageUploader/ImageUploader.tsx";
import {CardDto} from "../../../types/DTO/cardDto.ts";

type CardCreatorProps = {
    value: CardDto;
    onChange: (patch: Partial<CardDto>) => void;
};

export const CardCreator = ({ value, onChange }: CardCreatorProps) => {
    return (
        <>
            <div className="EntityCreatorBodyFooter">
                <ImageUploader
                    imagePath={value.thumbnail}
                    onUpload={(file) =>
                        onChange({
                            thumbnail: file?.name ?? null,
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
                            onChange({
                                extraFields: [
                                    ...value.extraFields,
                                    { id: crypto.randomUUID(), title: "" },
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
        </>
    );
};