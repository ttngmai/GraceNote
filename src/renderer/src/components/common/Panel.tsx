import { PanelCategory, TPanelLayout, TPanelSettings } from '@shared/types'
import PanelCategorySelector from './PanelCategorySelector'
import Button from './Button'
import { IconGripVertical } from '@tabler/icons-react'
import tw from 'twin.macro'
import BiblePanel from '../bible/BiblePanel'
import CodedBiblePanel from '../bible/CodedBiblePanel'
import LexiconPanel from '../lexicon/LexiconPanel'
import PanelSettingsDropdown from './PanelSettingsDropdown'
import { useSortable } from '@dnd-kit/sortable'
import CommentaryPanel from '../commentary/CommentaryPanel'

type PanelProps = {
  key?: string
  layout: TPanelLayout
  setting: TPanelSettings
  isOverlay?: boolean
  isDragging?: boolean
  isOver?: boolean
}

const Panel: React.FC<PanelProps> = ({
  layout,
  setting,
  isOverlay = false,
  isDragging = false,
  isOver = false
}: PanelProps) => {
  if (layout.state === 'hidden') return null

  const { id } = layout
  const { isBase, category, version, backgroundColor, textColor } = setting

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } = isOverlay
    ? {
        attributes: {},
        listeners: {},
        setNodeRef: undefined,
        setActivatorNodeRef: undefined,
        transform: null
      }
    : useSortable({ id })

  const style: React.CSSProperties = {
    zIndex: transform ? 9999 : 'auto'
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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        css={[
          tw`flex flex-col h-full border rounded bg-gray-200 shadow`,
          isOver ? tw`border-brand-blue-500` : undefined
        ]}
        style={style}
      ></div>
    )
  }

  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      css={[
        tw`flex flex-col h-full border rounded shadow`,
        isOver ? tw`border-brand-blue-500` : undefined
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
          ref={!isOverlay ? setActivatorNodeRef : undefined}
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
