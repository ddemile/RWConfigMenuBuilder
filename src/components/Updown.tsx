import { Line } from "react-konva";

const margin = 9

const arrowSize = {
    width: 8,
    height: 4
}

type UpdownProps = {
    width: number,
    height: number,
    x: number,
    y: number,
    color: string,
}

export function Updown({ width, height, x, y, color }: UpdownProps) {
    return (
        <>
            <Line width={arrowSize.width} height={arrowSize.height} fill={color} x={x + width - margin} y={y + arrowSize.height + margin} points={[0, 0, arrowSize.width / 2, arrowSize.height, arrowSize.width, 0]} strokeWidth={1.5} stroke={color} rotationDeg={180} />
            <Line width={arrowSize.width} height={arrowSize.height} fill={color} x={x + width - arrowSize.width - margin} y={y + height - arrowSize.height - margin} points={[0, 0, arrowSize.width / 2, arrowSize.height, arrowSize.width, 0]} strokeWidth={1.5} stroke={color} />
        </>
    );
}
