import {createEntityService} from "../localClient.ts";
import {db} from "../GlyphDB.ts";
import {createCard, deleteCard, updateCard} from "../entityControllers/cardController.ts";

export const cardsService = createEntityService(db.cards, {
    create: createCard,
    update: updateCard,
    remove: deleteCard,
});