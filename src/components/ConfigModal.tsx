import { ChangeEvent } from 'react';
import useConfig from "../hooks/useConfig.ts";
import Modal from './Modal.tsx';

export default function ConfigModal() {
    const { config, isOpen, setIsOpen, updateConfig } = useConfig()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target

        updateConfig({ [name]: checked ?? value })
    }

    return <Modal id="config-modal" className="bg-white border-[4px] border-black rounded-md inline text-black p-[5px] max-w-[350px] w-auto" isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h3 className='m-0'>Settings</h3>
        <div className='flex flex-col items-start gap-[6px]'>
            <div className="flex items-center">
                <input checked={config.titleElement} type="checkbox" name="titleElement" onChange={handleChange} />
                <label>Mod title element</label>
            </div>
            <div className="flex items-center">
                <input checked={config.addToolType} type="checkbox" name="addToolType" onChange={handleChange} />
                <label>Add tool name to the element name</label>
            </div>
        </div>
    </Modal>
}