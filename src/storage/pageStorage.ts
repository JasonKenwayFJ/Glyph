import {create} from 'zustand'

export interface PluginPage{
    id: string;
    content: string;
    source: string;
}

export interface PageStorage{
    pages: PluginPage[];
    addPage: (page: PluginPage) => void;
    removePagesBySource: (source: string) => void;
}

export const usePageStorage = create<PageStorage>((set) => ({
    pages: [],
    addPage: (page) => set((state) => ({
        pages: [...state.pages.filter((p) => p.id !== page.id), page]
    })),
    removePagesBySource: (source) => set((state) => ({
        pages: state.pages.filter((p) => p.source !== source)
    })),
}));