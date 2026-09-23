// Zustand — библиотека для хранения состояния вне React-дерева компонентов.
// Зачем нужно здесь: и тулбар, и (в будущем) плагины должны читать/менять
// один и тот же список кнопок, а они не являются родителем/ребёнком друг
// другу в дереве компонентов — обычный useState/пропсы сюда не подходят.
import { create } from 'zustand';

// Импортируем конкретные React-компоненты иконок из библиотеки Tabler.
// Каждый — это просто функция-компонент, которая рисует один конкретный SVG.
import {
    IconSettings,
    IconTrashFilled,
    IconHeartFilled,
    IconArticleFilled,
    IconFileDescriptionFilled,
    IconCardsFilled,
    IconListDetailsFilled,
    IconArrowAutofitWidthFilled,
    IconPictureInPictureFilled,
    IconPhotoFilled,
    IconMessageChatbotFilled,
} from '@tabler/icons-react';

// import type — импортирует только описание типа, без реального JS-кода.
// ComponentType — общий "тип компонента" из React, используем его как тип
// значений в маппинге иконок ниже.
import type { ComponentType } from 'react';

// Словарь "имя-строка → компонент иконки". Зачем: и хост, и плагины
// (когда дойдём до них) передают иконку как обычную строку (например,
// "settings"), а не как живой React-компонент — строку можно сериализовать
// в JSON и отправить через postMessage, компонент — нельзя.
// Record<string, ComponentType> — тип "объект, где ключ — любая строка,
// а значение — компонент React".
// Изменить: чтобы добавить новую иконку — импортируешь её сверху и
// добавляешь сюда новую пару ключ-компонент, больше менять ничего не надо.
export const ICON_MAP: Record<string, ComponentType> = {
    settings: IconSettings,
    trash: IconTrashFilled,
    favorite: IconHeartFilled,
    editor: IconArticleFilled,
    document: IconFileDescriptionFilled,
    cards: IconCardsFilled,
    tasks: IconListDetailsFilled,
    graph: IconArrowAutofitWidthFilled,
    media: IconPictureInPictureFilled,
    audio: IconPhotoFilled,
    assistant: IconMessageChatbotFilled,
};

// Общие поля, которые есть у ЛЮБОЙ кнопки сайдбара, независимо от её типа.
// Зачем отдельным интерфейсом: чтобы не дублировать эти четыре поля в
// каждом из двух типов кнопок ниже — они просто "наследуют" (extends) эти поля.
interface BaseButtonDescriptor {
    id: string;        // уникальный идентификатор — нужен React для key
    // при рендере списка, и чтобы потом можно было
    // найти/удалить/обновить конкретную кнопку
    label: string;      // текст, который увидит юзер на кнопке
    icon: string;        // ключ из ICON_MAP выше — НЕ имя импортированного
    // компонента, а ключ, который сам придумываешь
    order: number;       // число для сортировки — чем меньше, тем выше
    // кнопка в списке
    source: 'host' | string;  // откуда взялась кнопка: 'host' — родная кнопка
    // приложения, любая другая строка — id скрипта/плагина,
    // который её зарегистрировал. Нужно, чтобы можно было
    // снести именно кнопки конкретного скрипта, не трогая
    // остальные (см. removeButtonsBySource ниже)
}

// Тип кнопки-навигации — ведёт на существующую страницу приложения.
// extends BaseButtonDescriptor — забирает все 5 полей сверху и добавляет свои.
export interface NavButtonDescriptor extends BaseButtonDescriptor {
    type: 'nav';   // литеральный тип: значение может быть ТОЛЬКО строкой "nav",
                   // не любая строка. Это и есть "дискриминант" — по этому
                   // полю TypeScript потом различает, какой перед ним тип
    path: string;  // путь react-router, куда ведёт клик
}

// Тип кнопки-действия — не переходит никуда, а просто выполняет функцию по клику.
export interface ActionButtonDescriptor extends BaseButtonDescriptor {
    type: 'action';
    onClick: () => void;  // функция без аргументов, ничего не возвращает
}

// SidebarButtonDescriptor — "или то, или другое" (union-тип, объединение
// через |). Любая кнопка в системе — это ЛИБО NavButtonDescriptor,
// ЛИБО ActionButtonDescriptor, третьего не дано. Именно наличие общего
// поля-литерала type в обоих вариантах называется discriminated union —
// TypeScript может понять, какой из двух вариантов перед ним, просто
// проверив это одно поле (см. ButtonSideBar.tsx с if (props.type === 'nav')).
export type SidebarButtonDescriptor = NavButtonDescriptor | ActionButtonDescriptor;

// Описание "формы" самого Zustand-стора: какие данные внутри и какие
// функции для их изменения доступны снаружи.
interface SidebarStore {
    buttons: SidebarButtonDescriptor[];               // массив всех кнопок
    addButton: (button: SidebarButtonDescriptor) => void;   // добавить одну кнопку
    setButtonOrder: (id: string, newOrder: number) => void; // изменить порядок одной кнопки
    removeButtonsBySource: (source: string) => void;        // удалить все кнопки одного источника
}

// create<SidebarStore>(...) создаёт стор и сразу типизирует его через
// SidebarStore сверху — TS теперь проверяет, что и buttons, и все три
// функции реально присутствуют и имеют нужные сигнатуры.
// Результат create() — это React-хук (useSidebarStorage), который можно
// вызывать в любом компоненте, как обычный useState.
export const useSidebarStorage = create<SidebarStore>((set) => ({

    // Начальное состояние стора — те кнопки, что были захардкожены раньше,
    // просто теперь живут не в JSX, а как данные. source: 'host' у всех,
    // потому что это родные кнопки самого приложения, не от скриптов.
    buttons: [
        { id: 'main_page', type: 'nav', label: 'Редактор', icon: 'editor', path: '/mainPage', order: 0, source: 'host' },
        { id: 'documents', type: 'nav', label: 'Документы', icon: 'document', path: '/entityPage/Document', order: 1, source: 'host' },
        { id: 'cards', type: 'nav', label: 'Карточки', icon: 'cards', path: '/entityPage/Card', order: 2, source: 'host' },
        { id: 'tasks', type: 'nav', label: 'Задачи', icon: 'tasks', path: '/entityPage/Task', order: 3, source: 'host' },
        { id: 'graph', type: 'nav', label: 'Связи', icon: 'graph', path: '/entityPage/Graph', order: 4, source: 'host' },
        { id: 'favorites', type: 'nav', label: 'Избранное', icon: 'favorite', path: '/entityPage/Cards', order: 5, source: 'host' },
        { id: 'media', type: 'nav', label: 'Медиа', icon: 'media', path: '/entityPage/Media', order: 6, source: 'host' },
        { id: 'audio', type: 'nav', label: 'Аудио', icon: 'audio', path: '/entityPage/Audio', order: 7, source: 'host' },
        { id: 'trash', type: 'nav', label: 'Мусор', icon: 'trash', path: '/entityPage/Trash', order: 8, source: 'host' },
        { id: 'code', type: 'nav', label: 'Код', icon: 'trash', path: '/codeEditorPage', order: 9, source: 'host' },
        // ^ у этой кнопки icon: 'trash' — скорее всего копипаста, не задумка
        //   (у "Код" будет иконка корзины)
    ],

    // Добавить кнопку в конец массива. set() — специальная функция Zustand
    // для изменения состояния; она принимает функцию от текущего state и
    // возвращает объект с полями, которые нужно обновить.
    // [...state.buttons, button] — разворачиваем старый массив (spread) и
    // добавляем новый элемент в конец, создавая НОВЫЙ массив, а не
    // изменяя старый напрямую (важно для Zustand — он определяет "что-то
    // изменилось" по смене ссылки на объект/массив).
    addButton: (button) => set((state) => ({ buttons: [...state.buttons, button] })),

    // Найти кнопку по id и заменить её order на новое значение.
    // .map() проходит по всем кнопкам: если id совпал — возвращает КОПИЮ
    // этой кнопки с изменённым order ({ ...b, order: newOrder }), если не
    // совпал — возвращает кнопку как есть, без изменений.
    setButtonOrder: (id, newOrder) => set((state) => ({
        buttons: state.buttons.map((b) => b.id === id ? { ...b, order: newOrder } : b)
    })),

    // Убрать из массива все кнопки с конкретным source. Нужно перед
    // повторным запуском скрипта — чтобы не плодить дубликаты кнопок
    // при каждом нажатии "Применить".
    // .filter() оставляет только те кнопки, для которых условие true —
    // здесь "оставить всё, что НЕ равно source, который просят удалить".
    removeButtonsBySource: (source: string) => set((state) => ({
        buttons: state.buttons.filter((b) => b.source !== source)
    })),
}));