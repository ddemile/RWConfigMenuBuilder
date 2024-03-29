import React, { ChangeEvent, useMemo } from "react";
import { useStage } from "../contexts/StageContext.tsx";
import useCurrentPage from "../hooks/useCurrentPage.ts";
import usePages from "../hooks/usePages.ts";
import { ToolOption } from "../utils/config.tsx";
import { getElementTool } from "../utils/tools.ts";
import { Element } from "../utils/types.ts";
import Input from "./Input.tsx";

export default function Options() {
    const { pages, currentPage, updatePage } = usePages()
    const page = useCurrentPage()
    const stage = useStage()

    const updateElementProperty = (element: Element, property: string, value: any) => {
        if (getElementTool(element)?.options?.find(option => option.property == property)) {
            element.options[property] = value
        } else {
            (element as any)[property] = value
        }
    }

    const getElementProperty = (element: Element, property: string) => {
        if (getElementTool(element)?.options?.find(option => option.property == property)) {
            return element.options[property]
        } else {
            return (element as any)[property]
        }
    }


    const createUpdatePropertyHandler = (option: ToolOption, element: Element) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            const data = [...page.elements]
            const rectangle = data.find(rect => rect.id == pages[currentPage].selectedElementId)

            if (!rectangle) return;

            updateElementProperty(rectangle, option.property, value)

            if (element.options.minValue != undefined && element.options.maxValue != undefined) {
                updateElementProperty(rectangle, option.property, Math.max(element.options.minValue, Math.min(element.options.maxValue, getElementProperty(rectangle, option.property))))
            }

            const onChangeProps = option.onChange?.(value)

            for (let property in onChangeProps) {
                updateElementProperty(rectangle, property, onChangeProps[property])
            }

            updatePage(currentPage, { elements: data })
        }
    }

    function handleInputChangeEvent(e: ChangeEvent<HTMLInputElement>) {
        const { updatePage, currentPage, pages } = usePages.getState()

        const name = e.target.name;
        const value = e.target.value as any as number;
        const type = e.target.type
        const selectedElement = pages[currentPage].elements.find(element => element.id == pages[currentPage].selectedElementId)!

        const data = [...pages[currentPage].elements]
        const element = data.find(rect => rect.id == selectedElement.id)

        if (!element) return;

        const newValue = type == "number" ? Math.max(0, Math.min(value, stage.current.width() - (name == "x" ? element.width : element.height))) : value

        if (getElementTool(element)?.options?.find(option => option.property == name)) {
            element.options[name] = newValue
        } else {
            (element as any)[name] = newValue
        }

        updatePage(currentPage, { elements: data })
    }

    const element = page.selectedElement
    const tool = useMemo(() => getElementTool(page.selectedElement?.type!), [page.selectedElement])
    const hasConfigurable = useMemo(() => !!tool?.onBuild(element!).configurableType, [tool])

    return <>
        <label htmlFor="name">Name {!hasConfigurable && element && "(Optional)"}</label>
        <Input type="text" name='name' value={element?.name || ""} onChange={handleInputChangeEvent} />
        <label htmlFor="name">Description</label>
        <Input type="text" name='description' value={element?.description || ""} onChange={handleInputChangeEvent} />
        {!element?.locked?.position && <>
            <label htmlFor="name">X pos</label>
            <Input type='number' name='x' value={element?.x || 0} onChange={handleInputChangeEvent}></Input>
        </>}
        {!element?.locked?.position && <>
            <label htmlFor="name">Y pos</label>
            <Input type='number' name='y' value={element?.y || 0} onChange={handleInputChangeEvent}></Input>
        </>}
        {tool?.resizable?.width && !element?.locked?.transform && <>
            <label htmlFor="name">Width</label>
            <Input type='number' name='width' value={parseFloat((element?.width!).toFixed(1)) || 0} onChange={handleInputChangeEvent}></Input>
        </>}
        {tool?.resizable?.height && !element?.locked?.transform && <>
            <label htmlFor="name">Height</label>
            <Input type='number' name='height' value={parseFloat((page.selectedElement?.height!).toFixed(2)) || 0} onChange={handleInputChangeEvent}></Input>
        </>}
        <label htmlFor="name">Color</label>
        <Input className="appearance-none p-0 w-auto" type='color' name='color' value={page.selectedElement?.color || "#ffffff"} onChange={handleInputChangeEvent}></Input>
        {tool?.options?.map((option, index) => {
            const value = page.selectedElement?.options?.[option.property]
            const type = typeof page.selectedElement?.options[option.property]

            const element = React.createElement(option.element.type, {
                ...option.element.props,
                value: type == "number" ? parseFloat(value.toFixed(2)) : value ?? option.defaultValue,
                onChange: createUpdatePropertyHandler(option, page.selectedElement!)
            })
            return <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                <label>{option.name}</label>
                {element}
            </div>
        })}

    </>
}