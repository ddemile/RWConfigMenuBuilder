import { create } from "zustand"
import { Page } from "../utils/types.ts"

export interface PagesState {
    pages: Page[],
    currentPage: number,
    currentUniqueId: number,
    uniqueId: () => string,
    setCurrentUniqueId: (uniqueId: number) => void,
    createPage: (name: string) => void,
    deletePage: (index: number) => void,
    updatePage: (index: number, newProps: Partial<Page>) => void,
    setPages: (pages: Page[]) => void
}

export default create<PagesState>()((set, get) => ({
    pages: [{ name: "Main", elements: [], selectedElementId: null }],
    currentPage: 0,
    currentUniqueId: 0,
    uniqueId() {
        const { currentUniqueId } = get()
        
        set({ currentUniqueId: currentUniqueId + 1 })

        return currentUniqueId.toFixed()
    },
    setCurrentUniqueId(uniqueId) {
        set({ currentUniqueId: uniqueId })
    },
    createPage(name) {
        const { pages } = get()

        return [...pages, { name, elements: [], selectedElementId: null }]
    },
    deletePage(index) {
        if (index < 1) return;

        const pages = structuredClone(get().pages)

        pages.splice(index, 1)

        set({ pages, currentPage: get().currentPage - 1 })
    },
    updatePage(index, newProps) {
        const pages = structuredClone(get().pages)

        pages[index] = { ...pages[index], ...newProps }

        set({ pages })
    },
    setPages(pages) {
        set({ pages })
    }
}))