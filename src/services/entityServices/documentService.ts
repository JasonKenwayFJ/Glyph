import {createEntityService} from "../localClient.ts";
import {db} from "../GlyphDB.ts";
import {createDocument, deleteDocument, updateDocument} from "../entityControllers/documentController.ts";

export const documentsService = createEntityService(db.documents, {
    create: createDocument,
    update: updateDocument,
    remove: deleteDocument,
});