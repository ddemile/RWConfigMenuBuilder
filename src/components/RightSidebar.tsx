import { ChangeEvent } from 'react';
import { FiDownload, FiSettings, FiUpload } from 'react-icons/fi';
import { toast } from 'sonner';
import useConfig from '../hooks/useConfig.ts';
import useCurrentPage from '../hooks/useCurrentPage.ts';
import usePages from '../hooks/usePages.ts';
import Button from './Button.tsx';
import Options from './Options';

export default function RightSidebar() {
    const { pages, setPages } = usePages()
    const page = useCurrentPage()
    const { setIsOpen } = useConfig()

    const handleDownload = () => {
    const fileData = JSON.stringify({ pages, uniqueId: 0 /* TODO */ });
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "rw-option-builder-save.json";
        link.href = url;
        link.click();
    }

    const handleLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]!
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target!.result as string;

            try {
                const content = JSON.parse(fileContent)
                setPages(content.pages ?? content)
                // TODO
                // uniqueIdRef.current = content.uniqueId ?? 0
                toast.success("Save loaded",)
            } catch (error) {
                toast.error("An error appened while reading the save")
            }
        };
        reader.readAsText(file);
        e.target.value = ""
    }

    return (
        <nav className='bg-white flex flex-col m-0 h-full box-border w-[250px] p-[5px] border-l border-l-[#dadada] text-left [&>input]:mb-[10px]'>
            <Options />
            <Button onClick={() => page.update({ elements: page.elements.filter(rectangle => { console.log("rect id: " + rectangle.id + "selected: " + page.selectedElement); return rectangle.id != page.selectedElement?.id }) })}>Delete</Button>
            <Button className='flex justify-center items-center gap-[10px] mt-auto mb-[10px]' onClick={() => setIsOpen(true)}><FiSettings size={25} />Settings</Button>
            <Button onClick={handleDownload} className='flex justify-center items-center gap-[10px]' style={{ marginBottom: "10px" }}><FiDownload size={25} />Download</Button>
            <label className='text-white white rounded-lg border border-transparent py-[0.6em] px-[1.2em] text-[1em] font-medium bg-[#1a1a1a] cursor-pointer flex justify-center items-center gap-[10px]' htmlFor='load-save'><FiUpload size={25} />Load save</label>
            <input className='hidden' onChange={handleLoad} id='load-save' type="file" accept='.json' />
        </nav>
    )
}
