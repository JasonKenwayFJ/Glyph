import "./Tag.css"
import type {CharacteristicEntityCreator} from "../../../../types/LocalProps.ts";

const Tag = (props: CharacteristicEntityCreator) => {
    if (!props.title){
        return (
            <div className={props.isSelected ? "SelectedCategoryContainer" : "CategoryContainer"}>
                <p>+ добавить тег</p>
            </div>)
    }
    return(
        <div onClick={props.isSelected ? props.onRemove : props.onAdd} className={props.isSelected ? "EntityCreatorInputTagAdder" : "EntityCreatorInputTagEmpty"}>
            <p>{props.title}</p>
        </div>
    )
}
export default Tag;