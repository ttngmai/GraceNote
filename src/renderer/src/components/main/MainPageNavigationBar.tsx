import Button from '../common/Button'
import PanelTextSizeSelector from '../common/PanelTextSizeSelector'
import * as Separator from '@radix-ui/react-separator'
import SimpleLexicalCodeSearch from '../lexicon/SimpleLexicalCodeSearch'
import NavigationBar from '../common/NavigationBar'
import BibleSelector from '../bible/BibleSelector'
import PanelVisibilityControls from '../common/PanelVisibilityControls'
import tw from 'twin.macro'
import BibleVerseSearchIcon from '@public/icon/BibleVerseSearchIcon.svg?react'
import LexicalCodeSearchIcon from '@public/icon/LexicalCodeSearchIcon.svg?react'
import HymnSearchIcon from '@public/icon/HymnSearchIcon.svg?react'
import ColumnSettings from '../common/ColumnSettings'

export default function MainPageNavigationBar(): JSX.Element {
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
          <BibleVerseSearchIcon className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.context.openLexiconWindow()
          }}
          size="icon"
        >
          <LexicalCodeSearchIcon className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.context.openHymnWindow()
          }}
          size="icon"
        >
          <HymnSearchIcon className="w-5 h-5" />
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
        <ColumnSettings />
      </div>

      <div className="flex items-center shrink-0 w-fit ml-auto">
        <SimpleLexicalCodeSearch />
      </div>
    </NavigationBar>
  )
}
