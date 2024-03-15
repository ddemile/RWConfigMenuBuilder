import { Shape } from "konva/lib/Shape";
import { create } from "zustand";

interface SelectedShapeState {
    selectedShape: Shape | undefined,
    setSelectedShape: (shape: Shape | undefined) => void
}

export default create<SelectedShapeState>()((set) => ({
    selectedShape: undefined,
    setSelectedShape(shape) {
        set({ selectedShape: shape })
    },
}))