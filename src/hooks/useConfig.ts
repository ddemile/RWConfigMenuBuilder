import { create } from "zustand"

interface Config {
    titleElement: boolean,
    addToolType: boolean
}

interface ConfigState {
    config: Config,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    updateConfig: (newProps: Partial<Config>) => void
}

export default create<ConfigState>()((set, get) => ({
    config: {
        titleElement: false,
        addToolType: false
    },
    isOpen: false,
    setIsOpen(isOpen) {
        set({ isOpen })
    },
    updateConfig(newProps) {
        const { config } = get()

        set({ config: { ...config, ...newProps }})
    },
}))