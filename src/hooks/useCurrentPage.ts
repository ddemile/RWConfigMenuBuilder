import populateElement from "../utils/populateElement.ts";
import { Page } from "../utils/types.ts";
import usePages from "./usePages.ts";
import useSelectedShape from "./useSelectedShape.ts";

export default function useCurrentPage() {
    const { pages, currentPage, updatePage, deletePage } = usePages()
    const { setSelectedShape } = useSelectedShape()

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
        addElement(element: Parameters<typeof populateElement>[0]) {
            const elements = structuredClone(page.elements)
            
            elements.push(populateElement(element))

            this.update({ elements })
        },
        deleteElement(id: string) {
            updatePage(currentPage, {
                elements: page.elements.filter(rectangle => rectangle.id != id),
                selectedElementId: undefined
            })
            setSelectedShape(undefined)
        }
    }
}
