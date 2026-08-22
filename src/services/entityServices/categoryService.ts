import {createCharacteristicService} from "../localClient.ts";
import {db} from "../GlyphDB.ts";
import {createCategory, deleteCategory} from "../entityControllers/categoryController.ts";
export const categoryService = createCharacteristicService(db.categories, {
    createCharacteristic: createCategory,
    removeCharacteristic: deleteCategory,
});