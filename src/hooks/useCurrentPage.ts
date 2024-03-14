import { Element, Page } from "../utils/types.ts";
import usePages from "./usePages.ts";

export default function useCurrentPage() {
    const { pages, currentPage, updatePage, deletePage } = usePages()

    const { selectedElementId, ...page } = pages[currentPage]

    return {
        ...page,
        selectedElement: page.elements.find(element => element.id == selectedElementId),
        update(newProps: Partial<Page>) {
            updatePage(currentPage, newProps)
        },
        delete() {
            deletePage(currentPage)
        },
        addElement(element: Element) {
            if (!element.color) element.color = "#a9a4b2"
            if (!element.description) element.description = "Default description"
            if(!element.id) element.id = Math.round(Math.random() * 1000000).toFixed()

            const elements = structuredClone(page.elements)
            
            elements.push(element)

            this.update({ elements })
        }
    }
}
