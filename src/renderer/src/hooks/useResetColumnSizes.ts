import { columnSizesAtom, columnSizesResetKeyAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import useVisibleCols from './useVisibleCols'
import { nanoid } from 'nanoid'

export default function useResetColumnSizes(): () => void {
  const setColumnSizes = useSetAtom(columnSizesAtom)
  const setColumnSizesResetKey = useSetAtom(columnSizesResetKeyAtom)
  const visibleCols = useVisibleCols()

  const resetColumnSizes = (): void => {
    const visibleCount = visibleCols.length
    const equalSize = 100 / visibleCount

    setColumnSizes(Array(visibleCount).fill(equalSize))
    setColumnSizesResetKey(() => nanoid())
  }

  return resetColumnSizes
}
