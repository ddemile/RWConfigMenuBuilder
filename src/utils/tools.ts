import tools from "../data/tools";
import { Tool } from "./config.tsx";
import { Element } from "./types.ts";

export function getElementTool(element: Element | string): Tool | undefined {
    if (typeof element == "object") {
        return tools.find(tool => tool.name == element.type)
    } else {
        return tools.find(tool => tool.name == element)
    }
}