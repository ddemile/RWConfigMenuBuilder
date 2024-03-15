import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { MutableRefObject, createContext, useContext } from 'react';
import { Stage as KonvaStage } from 'react-konva';

type Context = {
    stageRef: MutableRefObject<typeof KonvaStage>,
    selectedShape: Shape,
    setSelectedShape: (shape: Shape | undefined) => void
}

const StageContext = createContext<Context>({
    stageRef: "NIB ",
} as any);

export default StageContext;

export function useStage(): { current: Stage } {
    const context = useContext(StageContext)

    return context.stageRef as any
}

export function useSelectedShape() {
    const context = useContext(StageContext)

    return { selectedShape: context.selectedShape, setSelectedShape: context.setSelectedShape }
}