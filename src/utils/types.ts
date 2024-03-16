
export interface Element {
    color: string,
    description: string,
    height: number,
    width: number,
    hidden: boolean,
    id: string,
    locked: Partial<{
        position: boolean,
        transform: boolean
    }>,
    name: string,
    type: string,
    x: number,
    y: number,
    options: any,
    title?: boolean
}

export interface Page {
    name: string,
    elements: Element[],
    selectedElementId: string | null
}

export type TODO = any