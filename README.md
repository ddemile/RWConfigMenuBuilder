# Rain World Config Menu Builder (RWConfigMenuBuilder)
## What is it ?
RW Option Builder is a tool to easily create config menu for Rain World mods

## Disabled tools
Disabled tools are W.I.P or just not implemented. You can implement them if you want !

## Adding new tools
To add new tools you need to modify `src/data/tools.tsx`, this file contains all the tools.
But before continuing you need to know what are [templates](#templates) and how to [create them](#adding-new-templates)

#### Here a some examples of tools
CheckBox
```tsx
defineTool({
    name: "OpCheckBox",
    width: 24,
    height: 24,
    content: <BiCheckboxChecked className='text-[30px]' />,
    element: (_element) => <Rect></Rect>,
    options: [
        {
            name: "Default Value",
            property: "defaultValue",
            element: <select>
                <option value="true">Checked</option>
                <option value="false">Unchecked</option>
            </select>,
            defaultValue: "false"
        }
    ],
    onBuild: () => ({
        template: "checkbox",
        configurableType: "bool"
    })
})
```

Slider
```tsx
defineTool({
    name: "OpSlider",
    width: 100,
    height: 10,
    content: "Slider",
    element: () => <Rect opacity={0}></Rect>,
    subElement: (widget, { updatePage, currentPage, pages }) => <Slider {...widget} key={widget.id} minValue={widget.options.minValue} maxValue={widget.options.maxValue} value={widget.options.sliderValue} onSliderValueChange={(value) => {
        const data = [...pages[currentPage].elements]
        const element = data.find(rect => rect.id == widget.id)!
        element.options.sliderValue = value

        updatePage(currentPage, { elements: data, selectedElementId: element.id })
    }} />,
    options: [
        {
            name: "Slider value",
            property: "sliderValue",
            element: <Input type='number'></Input>,
            defaultValue: 0
        },
        {
            name: "Max value",
            property: "maxValue",
            element: <Input type='number'></Input>,
            defaultValue: 100
        },
        {
            name: "Min value",
            property: "minValue",
            element: <Input type='number'></Input>,
            defaultValue: 0
        }
    ],
    onBuild: ({ sliderValue }) => ({
        template: "slider",
        variables: {
            defaultValue: Math.round(sliderValue),
            acceptable: "config_acceptable_range"
        },
        configurableType: "int",
        offset: {
            y: -10
        }
    })
})
```

## Tool documentation
### Name
The name of the tool (showed when overring)

### Width and height
The dimensions of the element

### Resizable `(Optional)`
Whether the element can be resized
```tsx
resizable: {
    width: true,
    height: true,
}
```

### Content
Content of the tool button, can be text, component or svg

### Element `(Optional)`
A function who return the actual element to render to the canvas, if not provided it will be a Rect element, the function needs to return a `react-konva` component, all the props of the widget are automatically spreaded into the element
```tsx
element: (widget) => <Rect fill={object.color} />
```

### SubElement `(Optional)`
Element but used when you need to render a component (like the slider) containing `react-konva` components, when you use SubElement in most cases, the sub element is the rendered element and element is the colide box, the props of the widget aren't spreaded into the element
```tsx
subElement: (widget, { updatePage, currentPage, pages }) => <Slider {...widget} key={widget.id} value={Math.max(widget.minValue, Math.min(widget.maxValue, widget.sliderValue))} onSliderValueChange={() => {...}} />
```

### Options `(Optional)`
Unique options of the tool
```tsx
options: [
    {
        name: "Slider value",
        property: "sliderValue",
        element: <input type='number'></input>,
        defaultValue: 0
    }
]
```

### OnBuild
A function executed when the element is builded, it needs to return an object like that: 
```ts
{
    template: "slider",
    // Optional
    configurableType: "int",
    // Optional
    variables: {
        myVar: "hello"
    },
    // Optional
    offset: {
        x: 10,
        y: -5
    }
}
```

## Templates
When an element is builded it uses a template, they are `.cst` files who contains snippets of `c#` code but with variables replaced on build, you create a variable like that: `$"VARNAME"` all the props of the element are variables but you can add custom variables by adding a key to the variables object in the [onBuild](#onbuild) function.
You can nest templates, to create a parent template you just need to add a variable with `CONTENT` inside (but you need to use that)

## Adding new templates
To add a new template, create a new file ending with `.cst` inside `public/templates`, you also need to add the name of the template (the name of the file without the extension)

## Submiting new tools
To submit new tools, you need to create a fork of the repository, make the changes to `tools.tsx` and `public/templates`, create a pull request

## Dependencies
- [ReactJS](https://github.com/facebook/react)
- [Konva](https://github.com/konvajs/konva)
- [Axios](https://github.com/axios/axios)
- [Lodash](https://github.com/lodash/lodash)
- [ReactIcons](https://github.com/react-icons/react-icons)
- [ReactKonva](https://github.com/konvajs/react-konva)
- [Sonner](https://github.com/emilkowalski/sonner)
- [Vite](https://github.com/vitejs/vite)
- [ESLint](https://github.com/eslint/eslint)
- [ReactModal](https://github.com/reactjs/react-modal)
- [TailwindMerge](https://github.com/dcastil/tailwind-merge)
- [Zustand](https://github.com/pmndrs/zustand)