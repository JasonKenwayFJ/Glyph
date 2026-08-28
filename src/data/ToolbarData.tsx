
import { router } from "../router/router.tsx";
type DropbarItem = {
    itemTitle: string;
    onPick: () => void;
};

export type DropbarItems = {
    label: string;
    items: DropbarItem[];
};
export const file: DropbarItems = {
    label: "Файл",
    items: [
        {
            itemTitle: "Новый проект",
            onPick: () => router.navigate("/projectCreate"),
        },
        {
            itemTitle: "Открыть проект",
            onPick: () => router.navigate("/projectPage"),
        },
        {
            itemTitle: "Сменить проект",
            onPick: () => router.navigate("/projectPage"),
        },
        {
            itemTitle: "Настройки",
            onPick: () => router.navigate("/settings"),
        },
        {
            itemTitle: "Выйти из аккаунта",
            onPick: async () => {
                router.navigate("/");
            },
        },
        {
            itemTitle: "Выйти",
            onPick: () => {},
        },
        // "Импорт проекта" / "Экспорт проекта" — пока нет реализации, оставь как есть
    ],
};

export const edit: DropbarItems = {
    label: "Правка",
    items: [
        {
            itemTitle: "Отменить",
            onPick: () => {},
        },
        {
            itemTitle: "Повторить",
            onPick: () => {},
        },
        {
            itemTitle: "Вырезать",
            onPick: () => {},
        },
        {
            itemTitle: "Копировать",
            onPick: () => {},
        },
        {
            itemTitle: "Вставить",
            onPick: () => {},
        },
        {
            itemTitle: "Выбрать всё",
            onPick: () => {},
        },
    ],
};

export const view: DropbarItems = {
    label: "Вид",
    items: [
        {
            itemTitle: "Показать боковую панель",
            onPick: () => {},
        },
        {
            itemTitle: "Полный экран",
            onPick: () => {},
        },
    ],
};

export const help: DropbarItems = {
    label: "Справка",
    items: [
        {
            itemTitle: "О приложении",
            onPick: () => {},
        },
    ],
};
export const DropbarItemsList: DropbarItems[] = [
    file,
    edit,
    view,
    help,
];