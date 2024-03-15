import { create } from "zustand"

export interface UniqueIdState {
    currentUniqueId: number,
    uniqueId: () => string,
    setCurrentUniqueId: (uniqueId: number) => void,
}

export default create<UniqueIdState>()((set, get) => ({
    currentUniqueId: 0,
    uniqueId() {
        const { currentUniqueId } = get()
        
        set({ currentUniqueId: currentUniqueId + 1 })

        return currentUniqueId.toFixed()
    },
    setCurrentUniqueId(uniqueId) {
        set({ currentUniqueId: uniqueId })
    }
}))