import "./FieldStyle.scss"

type fieldProp = {
    fieldName: string;
}
export const FieldElement = (data: fieldProp) => {
    return (
        <div className={"FieldContainer"}>
            <h1>{data.fieldName}</h1>
        </div>
    )
}