import { MAX_PANELS, PANEL_COLUMNS } from '@shared/constants'
import { PanelCategory, TPanelGrid, TPanelLayout, TPanelSettings } from '@shared/types'

export function createInitialPanelGrid(): TPanelGrid {
  const panels: TPanelLayout[] = Array.from({ length: MAX_PANELS }, (_, i) => {
    const row = Math.floor(i / PANEL_COLUMNS)
    const col = i % PANEL_COLUMNS
    return {
      id: `panel-${i}`,
      row,
      col,
      state: 'normal'
    }
  })

  const settings: Record<string, TPanelSettings> = Object.fromEntries(
    panels.map((panel) => [
      panel.id,
      {
        id: panel.id,
        isBase: panel.row === 0 && panel.col === 0,
        category: PanelCategory.NONE,
        version: '',
        backgroundColor: '#fff',
        textColor: '#000'
      }
    ])
  )

  return { panels, settings }
}

export function swapPanelPositions(
  panels: TPanelLayout[],
  id1: string,
  id2: string
): TPanelLayout[] {
  const p1 = panels.find((p) => p.id === id1)
  const p2 = panels.find((p) => p.id === id2)
  if (!p1 || !p2) return panels

  return panels.map((p) => {
    if (p.id === id1) {
      return {
        ...p,
        row: p2.row,
        col: p2.col,
        mergeRange: p2.mergeRange,
        state: p2.state
      }
    }
    if (p.id === id2) {
      return {
        ...p,
        row: p1.row,
        col: p1.col,
        mergeRange: p1.mergeRange,
        state: p1.state
      }
    }
    return p
  })
}

export function mergePanels(
  panels: TPanelLayout[],
  masterId: string,
  range: { startRow: number; startCol: number; endRow: number; endCol: number }
): TPanelLayout[] {
  return panels.map((panel) => {
    if (
      panel.row >= range.startRow &&
      panel.row <= range.endRow &&
      panel.col >= range.startCol &&
      panel.col <= range.endCol
    ) {
      if (panel.id === masterId) {
        return {
          ...panel,
          state: 'master',
          mergeRange: range
        }
      } else {
        return {
          ...panel,
          state: 'hidden',
          mergeRange: undefined
        }
      }
    }
    return panel
  })
}

export function unmergePanel(panels: TPanelLayout[], masterId: string): TPanelLayout[] {
  const master = panels.find((p) => p.id === masterId)
  if (!master || master.state !== 'master' || !master.mergeRange) return panels

  const { startRow, startCol, endRow, endCol } = master.mergeRange

  return panels.map((panel) => {
    if (
      panel.row >= startRow &&
      panel.row <= endRow &&
      panel.col >= startCol &&
      panel.col <= endCol
    ) {
      return {
        ...panel,
        state: 'normal',
        mergeRange: undefined
      }
    }
    return panel
  })
}

export function setPanelsVisibilityWithRestore(
  panels: TPanelLayout[],
  options: { hiddenRows: Set<number>; hiddenCols: Set<number> }
): TPanelLayout[] {
  const { hiddenRows, hiddenCols } = options

  return panels.map((panel) => {
    const shouldHide = hiddenRows.has(panel.row) || hiddenCols.has(panel.col)

    if (shouldHide) {
      if (!panel.originalState) {
        // 처음 숨길 때만 현재 상태를 저장
        return { ...panel, originalState: panel.state, state: 'hidden' }
      }
      return { ...panel, state: 'hidden' }
    } else {
      if (panel.originalState) {
        // 다시 보일 때는 원래 상태로 복원
        return { ...panel, state: panel.originalState, originalState: undefined }
      }
      return panel // 원래 숨기기 대상이 아니었다면 그대로 유지
    }
  })
}
