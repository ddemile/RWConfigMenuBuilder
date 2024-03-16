import axios from 'axios'
import { BiTrash } from 'react-icons/bi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { toast } from 'sonner'
import { useStage } from '../contexts/StageContext.tsx'
import tools from '../data/tools'
import useConfig from '../hooks/useConfig.ts'
import useCurrentPage from '../hooks/useCurrentPage.ts'
import usePages from '../hooks/usePages.ts'
import { Tool } from '../utils/config.tsx'
import { STAGE_HEIGHT, STAGE_WIDTH } from '../utils/constants.ts'
import findDuplicateValue from '../utils/findDuplicateValue'
import { Compiler, Component, Templates } from '../utils/optionsCompiler'
import { toCamelCase, toPascalCase } from "../utils/stringFormatting"
import { getElementTool } from '../utils/tools'
import { Element } from '../utils/types.ts'
import useKeyboardShortcut from '../utils/useKeyboardShortcut.ts'
import Button from './Button.tsx'
import Input from './Input.tsx'

export default function LeftSidebar() {
    const { pages, createPage, currentPage, setCurrentPage } = usePages()
    const { config } = useConfig()
    const page = useCurrentPage()
    const stage = useStage()

    const handleAddElement = (_e: any, tool: Tool) => {
        const width = tool.width
        const height = tool.height

        console.log(`[Info] Add ${tool.name}`)
        page.addElement({
            type: tool.name,
            name: `My${tool.name}`,
            x: STAGE_WIDTH / 2 - width / 2,
            y: STAGE_HEIGHT / 2 - height / 2,
            width,
            height,
            locked: {
                position: false
            },
            options: tool.options?.reduce<Record<string, any>>((accumulator, option) => {
                accumulator[option.property] = option.defaultValue
                return accumulator
            }, {})
        } as any)
    }

    const handleBuild = () => {
        const templates: Templates = {}

        let duplicatePageName = findDuplicateValue(pages.map(page => page.name))
        if (duplicatePageName) return toast.error(`Duplicated page name: ${duplicatePageName}`)

        const elements = pages.reduce<Element[]>((accumulator, { elements }) => ([...accumulator, ...elements]), [])
        let duplicateElementName = findDuplicateValue(elements.filter(element => getElementTool(element)?.onBuild(element).configurableType).map(element => toPascalCase(element.name)))
        if (duplicateElementName) return toast.error(`Duplicated element name: ${duplicateElementName}`)

        axios.get<string[]>("templates/list.json").then(({ data }) => {
            const promises = data.map(template => axios.get(`templates/${template}.cst`).then(({ data }) => {
                templates[template] = data
            }))

            Promise.all(promises).then(() => {
                const compiler = new Compiler("file", templates)
                const mainClass = new Component("options_class", compiler.componentTemplates).setVariables({ className: "Options", parentClass: "OptionInterface" })
                const initialize = new Component("initialize", compiler.componentTemplates).setVariables({ tabs: pages.length })
                pages.forEach((page, index) => initialize.add(new Component("tab", compiler.componentTemplates).setVariables({ tab: index, name: page.name })))
                compiler.add(mainClass)
                mainClass.add(initialize)
                pages.forEach((page, index) => {
                    for (let element of page.elements.filter(element => !element.hidden)) {
                        let { name, description, type, x, y } = element;
                        const tool = getElementTool(type)!
                        const { template, variables = {}, configurableType, offset = {} } = tool.onBuild(element)
                        const offsetX = offset.x ?? 0
                        const offsetY = offset.y ?? 0

                        const elementName = toCamelCase(config.addToolType ? name + tool.name.replace("Op", "") : name)

                        console.log(`Stage Y : ${stage?.current.height()} | Y: ${y} | ${element.height} | Total: ${stage?.current.height() - y - element.height}`)
                        const component = new Component(template, compiler.componentTemplates).setVariables({ ...element, ...element.options, ...variables, name: elementName, y: stage?.current.height() - y - element.height + offsetY, x: x + offsetX, pageIndex: index.toString(), configurable: configurableType ? toCamelCase(name) : undefined })

                        if (component) {
                            initialize.add(component)
                            if (configurableType) mainClass.add(new Component("configurable", compiler.componentTemplates).setVariables({ name: toCamelCase(name), description, defaultValue: element.options.defaultValue ?? variables.defaultValue?.toString(), type: configurableType, tag: description, acceptable: variables.acceptable ? new Component(variables.acceptable, compiler.componentTemplates).build({ variables: { ...element, ...element.options, ...variables }, inline: false }) : "null" }))
                        }
                    }
                })

                const output = compiler.build({ namespace: "TestMod" })

                console.log(output)
                navigator.clipboard.writeText(output)
                toast.success("Code copied to clipboard")
            })
        })
    }

    const handleSetCurrentPage = (value: any) => {
        if (!pages[value]) {
            if (!confirm("Create a new page ?")) return
            createPage("Page name")
        }
        
        setCurrentPage(value)
    }

    const handlePageDelete = () => {
        if (!confirm(`Do you really want to delete the page ${currentPage + 1} ?`)) return

        page.delete()
        toast.info(`Page ${currentPage + 1} deleted`)
    }

    useKeyboardShortcut(handleBuild, { code: "KeyB", ctrlKey: true })

    return (
        <nav className='bg-white flex flex-col m-0 h-full box-border w-[250px] p-[5px] border-r border-r-[#dadada] gap-[10px]'>
            {(tools as Tool[]).map((tool, index) => (
                <Button className='disabled:bg-[#0e0d0d] disabled:cursor-no-drop disabled:text-[#525252]' disabled={tool.wip} onClick={(e) => handleAddElement(e, tool)} name={tool.name} key={index} title={tool.name + (tool.wip ? " (W.I.P)" : "")}>
                    {tool.content}
                </Button>
            ))}
            <div className='mt-auto flex'>
                <Button className='p-0.5 disabled:text-neutral-400 disabled:bg-zinc-950 disabled:cursor-not-allowed' disabled={currentPage == 0} onClick={() => handleSetCurrentPage(currentPage >= 1 ? currentPage - 1 : currentPage)}><MdKeyboardArrowLeft size={30} /></Button>
                <p className='my-auto grow'>{currentPage + 1} / {pages.length}</p>
                <Button className='p-0.5 disabled:text-neutral-400 disabled:bg-zinc-950 disabled:cursor-not-allowed' disabled={currentPage == 9} onClick={() => handleSetCurrentPage(currentPage < 9 ? currentPage + 1 : currentPage)}><MdKeyboardArrowRight size={30} /></Button>
            </div>
            <div className='flex gap-[5px]'>
                <Input className='w-full text-sm' type="text" name='page' value={page.name || ""} onChange={(e) => page.update({ name: e.target.value })} />
                <Button className='bg-red-500 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed p-[10px]' disabled={currentPage == 0} onClick={handlePageDelete}><BiTrash size={22} /></Button>
            </div>
            <Button onClick={handleBuild}>Build project</Button>
        </nav>
    )
}
