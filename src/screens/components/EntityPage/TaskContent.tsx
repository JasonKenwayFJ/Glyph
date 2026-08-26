import {EntityPageContentProp} from "../../../types/LocalProps.ts";
import {Searcher} from "../Shared/Searcher.tsx";

export const TaskContent = (props : EntityPageContentProp) => {
    let value: {} = "";
    return (
        <div className={"TasksContainer"}>
            <div style={{justifySelf: "center"}}>

                <Searcher placeholder={"Поиск задачи"} value={value} setSearch={(value) = {}}/>
            </div>

            <div className={"Task"}>
                <div className={"TaskTitle"}>
                    <div>
                        <label>Название</label>

                    </div>
                    <div className={"TaskDescription"}>
                        <div className={"TaskCategory"}> <p>Категория</p></div>
                        <p>Описание</p>
                    </div>
                    <div>
                        <div style={{display: "flex", flexDirection:"row", gap: 50}}>
                            <p>приоритет:</p>
                            <p>статус:</p>
                        </div>
                    </div>
                </div>

                <div className={"TaskButtons"}>
                    <div>
                        <button>X</button>
                    </div>
                    <div>
                        <button>X</button>
                        <button>X</button>
                        <button>X</button>
                    </div>
                </div>
            </div>
        </div>
    )
}