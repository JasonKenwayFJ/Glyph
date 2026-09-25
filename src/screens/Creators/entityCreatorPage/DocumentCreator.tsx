import {DocumentDto} from "../../../types/DTO/documentDto.ts";


type DocumentCreatorProps = {
    value: DocumentDto;
    onChange: (patch: Partial<DocumentDto>) => void;
};

export const DocumentCreator = ({ value, onChange }: DocumentCreatorProps) => {
    return (
        <>
            <div className="EntityCreatorField">
                <p>Название</p>
                <input
                    type="text"
                    value={value.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Краткое описание</p>
                <input
                    type="text"
                    required
                    value={value.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                />
            </div>

            <div className="EntityCreatorField">
                <p>Содержание</p>
                <textarea
                    value={value.content}
                    required
                    onChange={(e) => onChange({ content: e.target.value })}
                />
            </div>
        </>
    );
};