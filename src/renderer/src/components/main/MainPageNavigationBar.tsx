import Button from '../common/Button'
import { IconMusic, IconRulerMeasure } from '@tabler/icons-react'
import PanelTextSizeSelector from '../common/PanelTextSizeSelector'
import * as Separator from '@radix-ui/react-separator'
import SimpleLexicalCodeSearch from '../lexicon/SimpleLexicalCodeSearch'
import NavigationBar from '../common/NavigationBar'
import BibleSelector from '../bible/BibleSelector'
import PanelVisibilityControls from '../common/PanelVisibilityControls'
import tw from 'twin.macro'
import BibleVerseSearch from '@public/icon/BibleVerseSearch.svg?react'
import LexicalCodeSearch from '@public/icon/LexicalCodeSearch.svg?react'
import useResetColumnSizes from '@renderer/hooks/useResetColumnSizes'

export default function MainPageNavigationBar(): JSX.Element {
  const resetColumnSizes = useResetColumnSizes()

  return (
    <NavigationBar sx={tw`h-80pxr`}>
      <div className="flex items-center shrink-0 w-fit">
        <BibleSelector />
      </div>

      <Separator.Root
        className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
        decorative
        orientation="vertical"
      />

      <div className="flex items-center shrink-0 gap-8pxr w-fit">
        <Button
          type="button"
          onClick={() => {
            window.context.openBibleVerseWindow()
          }}
          size="icon"
        >
          <BibleVerseSearch className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.context.openLexiconWindow()
          }}
          size="icon"
        >
          <LexicalCodeSearch className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.context.openHymnWindow()
          }}
          size="icon"
        >
          <IconMusic size={18} />
        </Button>
        <PanelTextSizeSelector />
      </div>

      <Separator.Root
        className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
        decorative
        orientation="vertical"
      />

      <PanelVisibilityControls />

      <Separator.Root
        className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
        decorative
        orientation="vertical"
      />

      <div className="flex items-center shrink-0 w-fit mr-8pxr">
        <Button type="button" onClick={() => resetColumnSizes()} size="icon">
          <IconRulerMeasure size={18} />
        </Button>
      </div>

      <div className="flex items-center shrink-0 w-fit ml-auto">
        <SimpleLexicalCodeSearch />
      </div>
    </NavigationBar>
  )
}
