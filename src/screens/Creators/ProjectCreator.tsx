import {useState} from "react";
import {open} from "@tauri-apps/plugin-dialog";
import "./../MainStyles/Panels/ProjectCreator.scss";
import {ProjectDto} from "../../types/DTO/ProjectDTO.ts";



type DataReceiverProps = {
    onClose: () => void;
    onCreate: (dto: ProjectDto) => void; // теперь принимает готовый DTO, а не отдельные строки
};

export const ProjectCreator = ({ onClose, onCreate }: DataReceiverProps) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 180); // ждём анимацию исчезновения перед реальным закрытием
    };

    const handlePickImage = async () => {
        const selected = await open({
            multiple: false,
            filters: [{ name: "Изображение", extensions: ["png", "jpg", "jpeg", "webp"] }],
        });
        if (typeof selected === "string") {
            setThumbnail(selected);
        }
    };

    return (
        <div
            className={`DataReceiverOverlay ${isClosing ? "isClosing" : ""}`}
            onClick={handleClose}
        >
            <form
                className={`DataReceiverContainer ${isClosing ? "isClosing" : ""}`}
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

                    const dto: ProjectDto = {
                        title,
                        description,
                        thumbnail,
                        imageSource: thumbnail ? "File" : null
                    };

                    onCreate(dto);
                }}
            >
                <h1 className="DataReceiverTitle">Новый проект</h1>

                <div
                    className="ThumbnailPicker"
                    onClick={handlePickImage}
                    style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
                >
                    {!thumbnail && <span className="ThumbnailPickerHint">Добавить обложку</span>}
                </div>

                <div className="FloatField">
                    <input
                        id="title"
                        name="title"
                        placeholder=" "
                        type="text"
                        className="DataReceiverInput"
                        required
                        autoFocus
                    />
                    <label htmlFor="title">Название</label>
                    <span className="FloatFieldLine" />
                </div>

                <div className="FloatField">
                    <textarea
                        id="description"
                        name="description"
                        placeholder=" "
                        className="DataReceiverTextarea"
                    />
                    <label htmlFor="description">Описание</label>
                    <span className="FloatFieldLine" />
                </div>

                <div className="DataReceiverButtonContainer">
                    <button type="submit" className="DataReceiverSubmit">
                        <span>Создать</span>
                    </button>
                    <button type="button" className="DataReceiverCancel" onClick={handleClose}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};