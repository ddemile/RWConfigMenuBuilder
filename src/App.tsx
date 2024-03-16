import { KonvaEventObject, Node } from 'konva/lib/Node'
import { createElement, useEffect, useRef } from 'react'
import { Layer, Stage, Transformer } from 'react-konva'
import Modal from "react-modal"
import { Toaster } from 'sonner'
import './App.css'
import ConfigModal from './components/ConfigModal.tsx'
import LeftSidebar from './components/LeftSidebar.tsx'
import ProjectLinks from './components/ProjectLinks.tsx'
import RightSidebar from './components/RightSidebar.tsx'
import StageContext from './contexts/StageContext.tsx'
import useConfig from './hooks/useConfig.ts'
import useCurrentPage from './hooks/useCurrentPage.ts'
import usePages from './hooks/usePages.ts'
import useSelectedShape from './hooks/useSelectedShape.ts'
import { STAGE_HEIGHT, STAGE_WIDTH } from './utils/constants.ts'
import { dragend, dragmove } from './utils/konvaSnap.tsx'
import { getElementTool } from './utils/tools.ts'
import useKeyboardShortcut from './utils/useKeyboardShortcut.ts'

Modal.setAppElement("#root")

function App() {
  const stageRef = useRef(null)
  const page = useCurrentPage()
  const store = usePages()
  const { selectedShape, setSelectedShape } = useSelectedShape()
  const { config } = useConfig()

  const updateSelectedElementPos = (pos: Partial<{ x: number, y: number }>) => {
    if (!page.selectedElement || !selectedShape) return;

    const stageWidth = STAGE_WIDTH;
    const stageHeight = STAGE_HEIGHT;
    const rectWidth = selectedShape!.width();
    const rectHeight = selectedShape.height();
    pos = { x: page.selectedElement.x, y: page.selectedElement.y, ...pos }

    // Limit the position of the rectangle within the bounds of the stage
    const newX = Math.max(0, Math.min(pos.x!, stageWidth - rectWidth));
    const newY = Math.max(0, Math.min(pos.y!, stageHeight - rectHeight));

    pos.x = Math.round(newX)
    pos.y = Math.round(newY)

    page.updateSelectedElement(pos)
  }

  useKeyboardShortcut(() => updateSelectedElementPos({ x: page.selectedElement!.x - 1 }), { code: "ArrowLeft" })
  useKeyboardShortcut(() => updateSelectedElementPos({ y: page.selectedElement!.y - 1 }), { code: "ArrowUp" })
  useKeyboardShortcut(() => updateSelectedElementPos({ x: page.selectedElement!.x + 1 }), { code: "ArrowRight" })
  useKeyboardShortcut(() => updateSelectedElementPos({ y: page.selectedElement!.y + 1 }), { code: "ArrowDown" })

  useKeyboardShortcut(() => {
    page.deleteElement(page.selectedElement?.id!)
  }, { code: "Delete" })

  const getElementByNode = (node: Node) => page.elements.find(element => element.id == node?.attrs?.id)

  const getEnabledAnchors = () => {
    const tool = getElementTool(page.selectedElement!)
    if (getElementByNode(selectedShape!)?.locked?.transform) return []
    if (!tool) return []

    const enabledAnchors = []
    if (tool.resizable?.width) {
      enabledAnchors.push("middle-right", "middle-left")
    }
    if (tool.resizable?.height) {
      enabledAnchors.push("top-center", "bottom-center")
    }
    if (tool.resizable?.width && tool.resizable?.height) {
      enabledAnchors.push("top-left", "top-right", "bottom-left", "bottom-right")
    }

    return enabledAnchors
  }

  useEffect(() => {
    if (config.titleElement != null) {
      const page = store.pages[0]

      const elements = page.elements.slice()
      const element = elements.find(element => element.title)
      if (!element) return
      element.hidden = !config.titleElement
      store.updatePage(0, {
        elements
      })
    }
  }, [config])

  const handleTransform = (e: KonvaEventObject<Event>) => {
    e.target.setAttrs({
      width: e.target.width() * e.target.scaleX(),
      height: e.target.height() * e.target.scaleY(),
      scaleX: 1,
      scaleY: 1,
    });

    selectedShape?.setAttrs(e);
    const elements = page.elements.slice()
    let element = elements.find(element => element.id == e.target.attrs.id)!
    element.width = e.target.width()
    element.height = e.target.height()
    element.x = Math.round(e.target.x())
    element.y = Math.round(e.target.y())

    page.update({ elements })
  }

  const handleRectDrag = (event: any) => {
    dragmove(event)

    const stageWidth = STAGE_WIDTH;
    const stageHeight = STAGE_HEIGHT;
    const rectWidth = event.target.width();
    const rectHeight = event.target.height();
    const rectX = event.target.x();
    const rectY = event.target.y();

    // Limit the position of the rectangle within the bounds of the stage
    const newX = Math.max(0, Math.min(rectX, stageWidth - rectWidth));
    const newY = Math.max(0, Math.min(rectY, stageHeight - rectHeight));

    const data = [...page.elements]
    const rectangle = data.find(rect => rect.id == event.target.attrs.id)!
    rectangle.x = Math.round(newX)
    rectangle.y = Math.round(newY)

    page.update({ elements: data, selectedElementId: event.target.attrs.id })
    setSelectedShape(event.target)

    event.target.setAttrs({
      x: newX,
      y: newY,
    })
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Check if the clicked element is the stage (root)
    if (e.target === e.target.getStage()) {
      setSelectedShape(undefined); // Unselect the current element
      page.update({ selectedElementId: null })
    }
  };

  return (
    <StageContext.Provider value={{ stageRef: stageRef as any }}>
      <Toaster richColors />
      <ConfigModal />
      <ProjectLinks />
      <main className='h-[100vh] m-0 flex'>
        <LeftSidebar />
        <div className='w-full h-full flex justify-center items-center gap-[50px]'>
          <Stage className='bg-white shadow-xl border-2 border-black' ref={stageRef} width={800} height={800} scale={{ x: 800 / STAGE_WIDTH, y: 800 / STAGE_WIDTH }} onClick={handleStageClick}>
            <Layer onDragEnd={dragend}>
              {page.elements.filter(element => !element.hidden).sort((a, b) => b.width * b.height - a.width * a.height).map((rectangle) => {
                const tool = getElementTool(rectangle)
                const element = tool?.element?.(rectangle, store)
                return createElement(element?.type ?? "Rect", {
                  ...element?.props,
                  cornerRadius: 5,
                  x: rectangle.x,
                  y: rectangle.y,
                  width: rectangle.width,
                  height: rectangle.height,
                  ...(element?.type == "Text" ? {
                    fill: rectangle.color
                  } : {
                    stroke: rectangle.color
                  }),
                  draggable: !page.elements.find(e => e.id == rectangle.id)?.locked?.position,
                  key: rectangle.id,
                  id: rectangle.id,
                  onDragMove: handleRectDrag,
                  name: 'object',
                  onClick: (e: any) => { page.update({ selectedElementId: e.target.attrs.id }); setSelectedShape(e.target) }
                })
              })}
              {page.elements.map((element) => {
                const tool = getElementTool(element)
                const subElement = tool?.subElement?.(element, store)
                if (!subElement) return
                return subElement
              })}

              {selectedShape && (
                <Transformer onTransform={handleTransform} rotateEnabled={false} node={selectedShape as any} enabledAnchors={getEnabledAnchors()}></Transformer>
              )}
            </Layer>
          </Stage>
        </div>
        <RightSidebar />
      </main>
    </StageContext.Provider>
  )
}

export default App
