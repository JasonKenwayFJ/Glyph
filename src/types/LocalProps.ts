export type CharacteristicEntityCreator = {
    id?: string,
    title?: string,
    onRemove?: () => void,
    onAdd?: () => void,
    isSelected?: boolean
}