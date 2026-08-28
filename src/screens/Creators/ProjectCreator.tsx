import "./../MainStyles/Panels/ProjectCreator.scss"
type DataReceiverProps = {
    onClose: () => void;
    onCreate: (title: string, description: string) => void;
}
export const ProjectCreator = ({ onClose, onCreate }: DataReceiverProps) => {

    return(
        <div className="DataReceiverOverlay" onClick={onClose}>
            <form
                className="DataReceiverContainer"
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
                    onCreate(title, description);
                }}
            >
                <h1 className="DataReceiverTitle">Новый проект</h1>

                <div className="FloatField">
                    <input

                        id="title"
                        name="title"
                        placeholder=" "
                        type="text"
                        className="DataReceiverInput"
                        required
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
                    <button type="button" className="DataReceiverCancel" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    )
}