import { useAtom, useAtomValue } from 'jotai'
import {
  readWriteHiddenColsAtom,
  readWriteHiddenRowsAtom,
  readWritePanelGridAtom
} from '@renderer/store'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import Panel from './Panel'
import { swapPanelPositions } from '@renderer/utils/panelUtils'

export default function PanelGrid(): JSX.Element {
  const [panelGrid, setPanelGrid] = useAtom(readWritePanelGridAtom)
  const { panels, settings } = panelGrid
  const hiddenRows = useAtomValue(readWriteHiddenRowsAtom)
  const hiddenCols = useAtomValue(readWriteHiddenColsAtom)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const swapped = swapPanelPositions(panels, String(active.id), String(over.id))
    setPanelGrid({ ...panelGrid, panels: swapped })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={panels.map((p) => p.id)} strategy={rectSwappingStrategy}>
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] grid-rows-[repeat(auto-fit,minmax(0,1fr))] gap-4pxr w-full h-full`}
        >
          {panels.map((layout) => {
            const setting = settings[layout.id]
            return (
              <Panel
                key={layout.id}
                layout={layout}
                settings={setting}
                hiddenRows={new Set(hiddenRows)}
                hiddenCols={new Set(hiddenCols)}
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}
