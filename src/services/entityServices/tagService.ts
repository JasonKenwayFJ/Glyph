import {createCharacteristicService} from "../localClient.ts"; // это верно!

import {db} from "../GlyphDB.ts";
import {createTag, deleteTag} from "../entityControllers/tagController.ts";

export const tagService = createCharacteristicService(db.tags, {
    createCharacteristic: createTag,
    removeCharacteristic: deleteTag,
});