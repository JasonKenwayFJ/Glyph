import {EntityPageContentProp} from "../../../types/LocalProps.ts";
import {Searcher} from "../Shared/Searcher.tsx";
import {Task} from "../Shared/Task/Task.tsx";

export const TaskContent = (props: EntityPageContentProp) => {
    let value: {} = "";
    return (
        <div className={"TasksContainer"}>
            <div style={{justifySelf: "center"}}>


            </div>

            <Task/>
        </div>
    )
}