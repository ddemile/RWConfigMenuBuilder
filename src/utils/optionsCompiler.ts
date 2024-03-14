function getSpacesAndTabs(text: string, word: string) {    
    const regex = new RegExp(`([ ]*)(\t*)(?=.*${word})`);
    const match = text.match(regex);
    
    if (match) return { spaces: match[1].length, tabs: match[2].length };

    return { spaces: 0, tabs: 0 };
}

type Variables = Record<string, any>
export type Templates = Record<string, string>

export class Compiler {
    mainComponent
    directory
    componentTemplates = {}

    constructor(componentName: string, templates: Templates) {
        this.directory = templates
        this.componentTemplates = templates

        this.mainComponent = new Component(componentName, this.componentTemplates)
    }

    add(component: Component) {
        return this.mainComponent.add(component)
    }

    build(variables: Variables = {}) {
        return this.mainComponent.build({ variables, inline: false })
    }
}

export class Component {
    public name: string
    public templates
    public components: Component[] = []
    public containerComponent = false
    public builded = false
    public variablesDefined = false
    public variables: Variables | null = null

    constructor(name: string, templates: Record<string, string>) {
        this.name = name
        this.templates = templates
    
        if (!(name in templates)) throw new Error(`The component ${this.name} doesn't exists`)
        if (templates[name].includes('$"CONTENT"')) this.containerComponent = true
    }

    build<const T extends boolean>({ variables = null, inline: _inline }: { variables?: Variables | null, inline?: T }): T extends true ? Component : string {
        const inline = _inline == null ? true : _inline

        if (variables) {
            this.variablesDefined = true
            this.variables = variables
        }
        let template = this.templates[this.name]
        if (this.containerComponent) {
            let content = []
            for (const component of this.components) {
                let componentTemplate = component.variablesDefined ? component.build({ inline: false }) : component.build({ variables: this.variables, inline: false })
                let { spaces, tabs } = getSpacesAndTabs(template, '\\$"CONTENT"')
                let lines = componentTemplate.split("\n").map(line => (componentTemplate.split("\n")[0] != line || content.length > 0) ? " ".repeat(spaces) + "\t".repeat(tabs) + line : line)
                content.push(lines.join("\n"))
            }

            template = template.replace("$\"CONTENT\"", content.join("\n\n"))
        }

        template = template.replace(/\$"([a-zA-Z]+)"/g, (_match, p1) => {
            return Object.entries(this.variables!).reduce((accumulator, [key, value]) => {
                accumulator[key.toUpperCase()] = value
                return accumulator
            }, {} as Record<string, string>)[p1]
        })

        this.builded = true

        return (inline ? this : template) as any
    }
    
    setVariables(variables: Variables) {
        this.variablesDefined = true
        this.variables = variables
        return this
    }

    add(component: Component) {
        this.components.push(component)
    }
}