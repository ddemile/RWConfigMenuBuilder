import { Stage } from 'konva/lib/Stage';
import { MutableRefObject, createContext, useContext } from 'react';
import { Stage as KonvaStage } from 'react-konva';

type Context = {
    stageRef: MutableRefObject<typeof KonvaStage>
}

const StageContext = createContext<Context>({
    stageRef: "NIB ",
} as any);

export default StageContext;

export function useStage(): { current: Stage } {
    const context = useContext(StageContext)

    return context.stageRef as any
}