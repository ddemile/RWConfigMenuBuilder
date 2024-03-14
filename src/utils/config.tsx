import { ReactElement, ReactNode } from "react"
import { PagesState } from "../hooks/usePages.ts"
import { Element } from "./types.ts"

export interface ToolOption {
    name: string,
    property: string,
    element: ReactElement,
    defaultValue: any,
    onChange?: (value: any) => any
}

export function defineTool<const O extends ToolOption[]>(tool: {
    name: string,
    width: number,
    height: number,
    content: ReactNode,
    isTextContainer?: boolean,
    resizable?: Partial<{
        width: boolean,
        height: boolean
    }>,
    wip?: boolean,
    element?: (options: Element & { options: Record<O[number]["property"], any> }, store: PagesState) => any,
    subElement?: (element: Element & { options: Record<O[number]["property"], any> }, store: PagesState) => any,
    options?: O,
    onBuild: (options: Record<O[number]["property"], any>) => {
        variables?: Record<string, any>,
        template: string,
        configurableType?: string,
        offset?: Partial<{
            x: number,
            y: number
        }>
    }
}) {
    return tool;
}

export type Tool = ReturnType<typeof defineTool>

export type Config = Tool[]