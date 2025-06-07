import { useAtom, useAtomValue } from 'jotai'
import { columnSizesAtom, columnSizesResetKeyAtom, panelGridAtom } from '@renderer/store'
import { PanelGroup, Panel as ResizablePanel, PanelResizeHandle } from 'react-resizable-panels'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import Panel from './Panel'
import { swapPanelPositions } from '@renderer/utils/panelUtils'
import { TPanelLayout } from '@shared/types'
import React, { useState } from 'react'
import useVisibleCols from '@renderer/hooks/useVisibleCols'

export default function PanelGrid(): JSX.Element {
  const [panelGrid, setPanelGrid] = useAtom(panelGridAtom)
  const [columnSizes, setColumnSizes] = useAtom(columnSizesAtom)
  const columnSizesResetKey = useAtomValue(columnSizesResetKeyAtom)
  const { panels, settings } = panelGrid
  const visibleCols = useVisibleCols()

  const sensors = useSensors(useSensor(PointerSensor))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent): void => {
    console.log('drag:', event.active)
    setActiveId(String(event.active.id))
  }

  const handleDragOver = ({ over }): void => {
    console.log('over:', over)
    setOverId(over?.id ?? null)
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) return

    const swapped = swapPanelPositions(panels, String(active.id), String(over.id))
    setPanelGrid({ ...panelGrid, panels: swapped })
  }

  const getLayoutFor = (col: number, row: number): TPanelLayout | null => {
    return panels.find((p) => p.col === col && p.row === row && p.state !== 'hidden') || null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={panels.map((p) => p.id)} strategy={rectSwappingStrategy}>
        <PanelGroup
          key={columnSizesResetKey}
          direction="horizontal"
          onLayout={(sizes) => setColumnSizes(sizes)}
          style={{ gap: '2px' }}
        >
          {visibleCols.map(({ colIndex }, visibleIndex) => (
            <React.Fragment key={`resizable-col-${colIndex}`}>
              <ResizablePanel
                defaultSize={columnSizes[visibleIndex] ?? 100 / visibleCols.length}
                minSize={5}
                order={colIndex}
              >
                <PanelGroup direction="vertical" style={{ gap: '4px' }}>
                  {[0, 1].map((rowIndex) => {
                    const layout = getLayoutFor(colIndex, rowIndex)
                    if (!layout) return null

                    const isDragging = layout.id === activeId
                    const isOver = layout.id === overId

                    return (
                      <ResizablePanel
                        key={layout.id}
                        defaultSize={50}
                        minSize={10}
                        order={rowIndex}
                      >
                        <Panel
                          layout={layout}
                          setting={settings[layout.id]}
                          isDragging={isDragging}
                          isOver={isOver}
                        />
                      </ResizablePanel>
                    )
                  })}
                </PanelGroup>
              </ResizablePanel>
              {visibleIndex < visibleCols.length - 1 && <PanelResizeHandle />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className="z-[9999] h-[calc(50vh-80px)] pointer-events-none opacity-90">
            <Panel
              layout={panels.find((p) => p.id === activeId)!}
              setting={settings[activeId]}
              isOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
