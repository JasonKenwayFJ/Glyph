import "./DataReceiver.css"

type DataReceiverProps = {
    onClose: () => void;
    onCreate: (title: string, description: string) => void;
}

const DataReceiver = ({ onClose, onCreate }: DataReceiverProps) => {
    return (
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
                    <button type="button" className="DataReceiverCancel" onClick={onClose}>
                        Отмена
                    </button>
                    <button type="submit" className="DataReceiverSubmit">
                        <span>Создать</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
export default DataReceiver