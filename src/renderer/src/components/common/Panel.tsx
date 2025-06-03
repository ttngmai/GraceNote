import { PanelCategory, TPanelLayout, TPanelSettings } from '@shared/types'
import PanelCategorySelector from './PanelCategorySelector'
import Button from './Button'
import { IconGripVertical } from '@tabler/icons-react'
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
  setting: TPanelSettings
}

const Panel: React.FC<PanelProps> = ({ layout, setting }: PanelProps) => {
  if (layout.state === 'hidden') return null

  const { id, row, col, mergeRange, state } = layout
  const { isBase, category, version, backgroundColor, textColor } = setting
  const isMaster = state === 'master' && mergeRange

  const visibleStartRow = isMaster ? mergeRange.startRow + 1 : row + 1
  const visibleEndRow = isMaster ? mergeRange.endRow + 1 : 0
  const visibleStartCol = isMaster ? mergeRange.startCol + 1 : col + 1
  const visibleEndCol = isMaster ? mergeRange.endCol + 1 : 0

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
      <div className="flex items-center p-1pxr rounded-t bg-gray-300">
        <PanelSettingsDropdown panelId={id} sx={tw`shrink-0`} />

        <PanelCategorySelector
          panelId={id}
          placeholder={version}
          sx={tw`w-[calc(100%-64px)] h-32pxr rounded-md hover:bg-[#F4F4F5] font-bold`}
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

export default Panel
