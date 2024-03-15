import store from "../hooks/useUniqueId.ts"
import { Element } from "./types.ts"

type RequiredProps = "height" | "width" | "x" | "y" | "type"

type InitElement = Partial<Omit<Element, RequiredProps>> & Required<Pick<Element, RequiredProps>>

export default function populateElement({
    name = "",
    color = "#a9a4b2",
    id = store.getState().uniqueId(),
    options = {},
    description = "Default description",
    locked = {},
    hidden = false,
    ...element
}: InitElement): Element {
    return {
        ...element,
        name,
        id,
        color,
        options,
        description,
        locked,
        hidden
    }
}