import { PanelCategory, TPanelLayout, TPanelSettings } from '@shared/types'
import PanelCategorySelector from './PanelCategorySelector'
import Button from './Button'
import { IconCrown, IconGripVertical } from '@tabler/icons-react'
import tw, { css } from 'twin.macro'
import BiblePanel from '../bible/BiblePanel'
import CodedBiblePanel from '../bible/CodedBiblePanel'
import LexiconPanel from '../lexicon/LexiconPanel'
import PanelSettingsDropdown from './PanelSettingsDropdown'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CommentaryPanel from '../commentary/CommentaryPanel'

type PanelProps = {
  key?: string
  layout: TPanelLayout
  settings: TPanelSettings
  hiddenRows: Set<number>
  hiddenCols: Set<number>
}

const Panel: React.FC<PanelProps> = ({ layout, settings, hiddenRows, hiddenCols }: PanelProps) => {
  if (layout.state === 'hidden') return null

  const { id, row, col, mergeRange, state } = layout
  const { isBase, category, version, backgroundColor, textColor } = settings
  const isMaster = state === 'master' && mergeRange

  const visibleStartRow = isMaster
    ? getVisibleIndex(mergeRange.startRow, hiddenRows)
    : getVisibleIndex(row, hiddenRows)
  const visibleEndRow = isMaster ? getVisibleIndex(mergeRange.endRow, hiddenRows) : 0
  const visibleStartCol = isMaster
    ? getVisibleIndex(mergeRange.startCol, hiddenCols)
    : getVisibleIndex(col, hiddenCols)
  const visibleEndCol = isMaster ? getVisibleIndex(mergeRange.endCol, hiddenCols) : 0

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } = useSortable({
    id: layout.id
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform)
  }

  const renderPanel = (): JSX.Element => {
    switch (category) {
      case PanelCategory.BIBLE:
        return (
          <BiblePanel
            version={version}
            isBase={isBase}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
        )
      case PanelCategory.COMMENTARY:
        return (
          <CommentaryPanel
            version={version}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
        )
      case PanelCategory.CODED_BIBLE:
        return (
          <CodedBiblePanel
            version={version}
            isBase={isBase}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
        )
      case PanelCategory.LEXICON:
        return (
          <LexiconPanel version={version} backgroundColor={backgroundColor} textColor={textColor} />
        )
      default:
        return <div className="w-full h-full" style={{ backgroundColor }}></div>
    }
  }

  return (
    <div
      ref={setNodeRef}
      css={[
        tw`flex flex-col h-full border rounded shadow`,
        css`
          ${isMaster
            ? `
              grid-row-start: ${visibleStartRow};
              grid-row-end: ${visibleEndRow + 1};
              grid-column-start: ${visibleStartCol};
              grid-column-end: ${visibleEndCol + 1};
            `
            : `
              grid-row-start: ${visibleStartRow};
              grid-column-start: ${visibleStartCol};
          `}
        `
      ]}
      style={style}
    >
      <div className="flex items-center p-1pxr rounded-t bg-gray-200">
        <PanelSettingsDropdown panelId={id} />

        <PanelCategorySelector
          panelId={id}
          placeholder={
            <span className="flex justify-center items-center gap-4pxr select-none">
              {isBase ? <IconCrown size={16} /> : ''}
              {version}
            </span>
          }
          sx={tw`w-full h-32pxr rounded-md hover:bg-[#F4F4F5]`}
        />

        <Button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          type="button"
          variant="ghost"
          size="icon"
          sx={tw`shrink-0 cursor-move`}
        >
          <IconGripVertical size={14} />
        </Button>
      </div>

      {renderPanel()}
    </div>
  )
}

function getVisibleIndex(index: number, hiddenSet: Set<number>): number {
  let visibleIndex = 0
  for (let i = 0; i <= index; i++) {
    if (!hiddenSet.has(i)) {
      visibleIndex++
    }
  }
  return visibleIndex
}

export default Panel
