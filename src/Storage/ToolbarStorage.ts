import { create } from 'zustand';
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
import type { ComponentType } from 'react';

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

interface BaseButtonDescriptor {
    id: string;
    label: string;
    icon: string;
    order: number;
}

export interface NavButtonDescriptor extends BaseButtonDescriptor {
    type: 'nav';
    path: string;
}

export interface ActionButtonDescriptor extends BaseButtonDescriptor {
    type: 'action';
    onClick: () => void;
}

export type SidebarButtonDescriptor = NavButtonDescriptor | ActionButtonDescriptor;

interface SidebarStore {
    buttons: SidebarButtonDescriptor[];
    addButton: (button: SidebarButtonDescriptor) => void;
    setButtonOrder: (id: string, newOrder: number) => void;
}

export const useSidebarStorage = create<SidebarStore>((set) => ({
    buttons: [
        { id: 'main_page', type: 'nav', label: 'Редактор', icon: 'editor', path: '/mainPage', order: 0 },
        { id: 'documents', type: 'nav', label: 'Документы', icon: 'document', path: '/entityPage/Document',order: 1 },
        { id: 'cards', type: 'nav', label: 'Карточки', icon: 'cards', path: '/entityPage/Card',order: 2 },
        { id: 'tasks', type: 'nav', label: 'Задачи', icon: 'tasks', path: '/entityPage/Task',order: 3 },
        { id: 'graph', type: 'nav', label: 'Связи', icon: 'graph', path: '/entityPage/Graph',order: 4 },
        { id: 'favorites', type: 'nav', label: 'Избранное', icon: 'favorite', path: '/entityPage/Cards',order: 5 },
        { id: 'media', type: 'nav', label: 'Медиа', icon: 'media', path: '/entityPage/Media',order: 6 },
        { id: 'audio', type: 'nav', label: 'Аудио', icon: 'audio', path: '/entityPage/Audio',order: 7 },
        { id: 'trash', type: 'nav', label: 'Мусор', icon: 'trash', path: '/entityPage/Trash',order: 8 },
        { id: 'code', type: 'nav', label: 'Код', icon: 'trash', path: '/codeEditorPage',order: 8 },
    ],
    addButton: (button) => set((state) => ({ buttons: [...state.buttons, button] })),
    setButtonOrder: (id, newOrder) => set((state) => ({
        buttons: state.buttons.map((b) => b.id === id ? { ...b, order: newOrder } : b)
    })),
}));
