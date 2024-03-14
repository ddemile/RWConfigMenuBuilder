import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useState } from "react";
import { Rect } from "react-konva";

const sliderHandleSize = {
    width: 13,
    height: 22
};

type SliderProps = {
    width: number,
    height: number,
    x: number,
    y: number,
    color: string,
    onSliderValueChange: (value: number) => void,
    value: number,
    maxValue: number,
    minValue: number
}

export function Slider({ width, height, x, y, color, onSliderValueChange, value, maxValue, minValue }: SliderProps) {
    const [sliderValue, setSliderValue] = useState(0);

    const handleSliderDrag = (e: KonvaEventObject<DragEvent>) => {
        const newValue = (e.target.x() + sliderHandleSize.width / 2 - x) / width;
        const scaledValue = minValue + newValue * (maxValue - minValue);
        setSliderValue(scaledValue);
        onSliderValueChange(scaledValue);
    };

    useEffect(() => {
        setSliderValue(value);
    }, [value]);

    const scaledSliderValue = (sliderValue - minValue) / (maxValue - minValue);
    const handleX = x + scaledSliderValue * width - sliderHandleSize.width / 2;

    return (
        <>
            <Rect width={2} height={10} fill={color} x={x} y={y} />
            <Rect width={2} height={10} fill={color} x={x + width} y={y} />
            <Rect x={x} y={y + height / 2} width={width} height={2} fill={color} />
            <Rect
                cornerRadius={50}
                stroke={color}
                x={handleX}
                y={y + height / 2 - sliderHandleSize.height / 2}
                width={sliderHandleSize.width}
                height={sliderHandleSize.height}
                fill="white"
                draggable
                onDragMove={handleSliderDrag}
                dragBoundFunc={(pos) => ({
                    x: Math.max(x, Math.min(pos.x, width + x)) - sliderHandleSize.width / 2,
                    y: y + height / 2 - sliderHandleSize.height / 2,
                })}
            />
        </>
    );
}
