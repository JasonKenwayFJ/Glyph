import { db, type LocalEntity, type LocalCharacteristic, type LocalProjects } from "./GlyphDB.ts";
import { v4 as uuid } from "uuid";

function makeCharacteristic(title: string): LocalCharacteristic {
    return {
        id: uuid(),
        title,
        isSynced: true,
        pendingAction: null,
    };
}

function makeProject(overrides: Partial<LocalProjects> = {}): LocalProjects {
    return {
        id: uuid(),
        title: "Тестовый проект",
        description: "Описание проекта",
        category: [],
        tags: [],
        entities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSynced: true,
        pendingAction: null,
        ...overrides,
    };
}

function makeCard(overrides: Partial<LocalEntity> = {}): LocalEntity {
    return {
        id: uuid(),
        projectId: "",
        title: "Тестовая карточка",
        description: "Краткое описание для превью",
        content: "Полный текст содержания карточки...",
        imagePath: "",
        category: [],
        tags: [],
        hasImage: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        extraFields: [],
        isSynced: true,
        pendingAction: null,
        ...overrides,
    };
}

function makeDocument(overrides: Partial<LocalEntity> = {}): LocalEntity {
    return makeCard(overrides);
}


export async function seedDatabase() {

    const project = makeProject({
        title: "Тёмное фэнтези",
    });

    await db.projects.add(project);


    const tagHero = makeCharacteristic("герой");
    const tagLore = makeCharacteristic("лор");
    const tagAct1 = makeCharacteristic("акт-1");

    await db.tags.bulkAdd([
        tagHero,
        tagLore,
        tagAct1
    ]);


    const catCharacters = makeCharacteristic("Персонажи");
    const catLocations = makeCharacteristic("Локации");
    const catMechanics = makeCharacteristic("Механики");

    await db.categories.bulkAdd([
        catCharacters,
        catLocations,
        catMechanics
    ]);


    const cards: LocalEntity[] = [
        makeCard({
            title: "Кайра, наёмница",
            projectId: project.id,
            category: [catCharacters],
            tags: [tagHero, tagAct1],
        }),

        makeCard({
            title: "Дориан",
            projectId: project.id,
            category: [catCharacters],
            tags: [tagHero],
        }),

        makeCard({
            title: "Порт Аврис",
            projectId: project.id,
            category: [catLocations],
            tags: [tagLore],
        }),

        makeCard({
            title: "Система крафта",
            projectId: project.id,
            category: [catMechanics],
            tags: [],
        }),
    ];

    await db.cards.bulkAdd(cards);


    const documents: LocalEntity[] = [
        makeDocument({
            title: "Диздок: Система крафта",
            projectId: project.id,
            description: "Подробная механика крафта",
            content: "Здесь подробное описание реализации механики крафта...",
            category: [catMechanics],
            tags: [],
        }),

        makeDocument({
            title: "Лор порта Аврис",
            projectId: project.id,
            description: "История и предыстория локации",
            content: "Порт был основан...",
            category: [catLocations],
            tags: [tagLore],
        }),
    ];

    await db.documents.bulkAdd(documents);

    console.log("Тестовые данные добавлены");
}

export async function clearDatabase() {
    await db.cards.clear();
    await db.documents.clear();
    await db.locations.clear();
    await db.categories.clear();
    await db.tags.clear();
    await db.projects.clear();
    console.log("База очищена");
}

