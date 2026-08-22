import "./Category.css"
import type {CharacteristicEntityCreator} from "../../../../types/LocalProps.ts";

const Category = (props: CharacteristicEntityCreator) => {
    if (!props.title){
        return (
        <div className={props.isSelected ? "SelectedCategoryContainer" : "CategoryContainer"}>
            <p>+ Добавить</p>
        </div>)
    }
    return (
        <div onClick={props.isSelected ? props.onRemove : props.onAdd} className={props.isSelected ? "SelectedCategoryContainer" : "CategoryContainer"}>
            <p>{props.title}</p>
        </div>)
}
export default Category