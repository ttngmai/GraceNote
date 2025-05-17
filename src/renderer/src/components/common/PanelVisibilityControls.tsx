import React from 'react'
import { useAtom } from 'jotai'
import {
  readWriteHiddenColsAtom,
  readWriteHiddenRowsAtom,
  readWritePanelGridAtom
} from '@renderer/store'
import { setPanelsVisibilityWithRestore } from '@renderer/utils/panelUtils'
import tw from 'twin.macro'
import { PANEL_COLUMNS } from '@shared/constants'

const PanelVisibilityControls: React.FC = () => {
  const [panelGrid, setPanelGrid] = useAtom(readWritePanelGridAtom)
  const [hiddenRows, setHiddenRows] = useAtom(readWriteHiddenRowsAtom)
  const [hiddenCols, setHiddenCols] = useAtom(readWriteHiddenColsAtom)

  const toggleRow = (row: number): void => {
    const newHiddenRows = new Set(hiddenRows)
    if (newHiddenRows.has(row)) {
      newHiddenRows.delete(row)
    } else {
      newHiddenRows.add(row)
    }
    setHiddenRows(Array.from(newHiddenRows))

    const updatedPanels = setPanelsVisibilityWithRestore(panelGrid.panels, {
      hiddenRows: newHiddenRows,
      hiddenCols: new Set(hiddenCols)
    })
    setPanelGrid({ ...panelGrid, panels: updatedPanels })
  }

  const toggleCol = (col: number): void => {
    const newHiddenCols = new Set(hiddenCols)
    if (newHiddenCols.has(col)) {
      newHiddenCols.delete(col)
    } else {
      newHiddenCols.add(col)
    }
    setHiddenCols(Array.from(newHiddenCols))

    const updatedPanels = setPanelsVisibilityWithRestore(panelGrid.panels, {
      hiddenRows: new Set(hiddenRows),
      hiddenCols: newHiddenCols
    })
    setPanelGrid({ ...panelGrid, panels: updatedPanels })
  }

  return (
    <div className="flex gap-4pxr">
      {/* <div className="flex flex-col gap-4pxr">
        {Array.from({ length: 2 }, (_, row) => (
          <button
            key={row}
            type="button"
            onClick={() => toggleRow(row)}
            css={[
              tw`w-28pxr rounded`,
              hiddenRows.includes(row) ? tw`bg-gray-400` : tw`bg-amber-400`
            ]}
          >
            {row + 1}
          </button>
        ))}
      </div> */}
      <div className="flex items-stretch gap-4pxr">
        {Array.from({ length: PANEL_COLUMNS }, (_, col) => (
          <button
            key={col}
            type="button"
            onClick={() => toggleCol(col)}
            css={[
              tw`w-32pxr h-32pxr rounded`,
              hiddenCols.includes(col) ? tw`bg-gray-400` : tw`bg-teal-400`
            ]}
          >
            {col + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PanelVisibilityControls
