import { BiCheckboxChecked } from 'react-icons/bi';
import { BsInputCursorText } from 'react-icons/bs';
import { Rect, Text } from 'react-konva';
import Input from '../components/Input.tsx';
import { Slider } from '../components/Slider';
import { Config, defineTool } from '../utils/config.tsx';

export default [
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
    }),
    defineTool({
        name: "OpLabel",
        width: 48,
        height: 30,
        resizable: {
            width: true
        },
        isTextContainer: true,
        content: <BsInputCursorText className='text-[30px]' />,
        element: ({ options }) => <Text
            text={options.text} 
            align={options.alignment?.toLowerCase()}
            verticalAlign='middle'
            fontSize={options.bigText == "true" ? 14 * 1.7 : 14}
        />,
        options: [
            {
                name: "Text",
                property: "text",
                element: <Input type='string'></Input>,
                defaultValue: "some text"
            },
            {
                name: "Alignment",
                property: "alignment",
                element: <select name="alignment">
                    <option value="Center">Center</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="Custom">Custom</option>
                </select>,
                defaultValue: "Center"
            },
            {
                name: "Big Text",
                property: "bigText",
                element: <select name="bigText">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>,
                defaultValue: "false",
                onChange: (value: string) => ({
                    height: (value == "false" ? false : value) ? 51 : 30
                })
            }
        ],
        onBuild: () => ({
            template: "label"
        })
    }),
    defineTool({
        name: "OpDragger",
        width: 24,
        height: 24,
        content: "Dragger",
        wip: true,
        options: [
            {
                name: "Default (int)",
                property: "defaultValue",
                element: <Input type='number'></Input>,
                defaultValue: 0        
            }
        ],
        onBuild: () => ({
            template: ""
        })
    }),
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
        onBuild: ({ options: { sliderValue } }) => {
        return ({
            template: "slider",
            variables: {
                defaultValue: Math.round(sliderValue),
                acceptable: "config_acceptable_range"
            },
            configurableType: "int",
            offset: {
                y: -10
            }
        })}
    }),
    defineTool({
        name: "OpSliderSubtle",
        width: 0,
        height: 0,
        wip: true,
        content: "Slider Subtle",
        options: [
            {
                name: "W.I.P",
                property: "value",
                element: <Input type='number'></Input>,
                defaultValue: 0
            }
        ],
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpComboBox",
        width: 0,
        height: 0,
        wip: true,
        content: "Combo Box",
        options: [
        ],
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpColorPicker",
        width: 0,
        height: 0,
        wip: true,
        content: "Color Picker",
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpTextBox",
        width: 0,
        height: 0,
        wip: true,
        content: "Text Box",
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpImage",
        width: 48,
        height: 48,
        wip: true,
        content: "Image",
        options: [
            {
                name: "Url",
                property: "imageUrl",
                element: <Input type='string'></Input>,
                defaultValue: "https://image.api.playstation.com/gs2-sec/appkgo/prod/CUSA05667_00/9/i_6cb937c60858394b4e994880e2c37180c7c5629e994cf510e07b459735a6b7c1/i/icon0.png"
            },
        ],
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpScrollBox",
        width: 0,
        height: 0,
        wip: true,
        content: "Scroll Box",
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpKeyBinder",
        width: 0,
        height: 0,
        wip: true,
        content: "Key Binder",
        onBuild: () => ({
            template: ""
        })
    }),
    defineTool({
        name: "OpUpdown",
        width: 100,
        height: 30,
        resizable: {
            width: true
        },
        content: "Updown",
        options: [
            {
                name: "Updown value",
                property: "updownValue",
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
        onBuild: ({ options: { updownValue } }) => ({
            variables: {
                defaultValue: Math.round(updownValue),
                acceptable: "config_acceptable_range"
            },
            template: "updown",
            configurableType: "int"
        })
    }),
    defineTool({
        name: "OpRect",
        width: 100,
        height: 60,
        resizable: {
            width: true,
            height: true
        },
        content: "Rectangle",
        onBuild: () => ({
            template: "rectangle"
        })
    })
] as const satisfies Config