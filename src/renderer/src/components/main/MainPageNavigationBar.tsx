import Button from '../common/Button'
import { IconAlphabetHebrew, IconListSearch, IconMusic } from '@tabler/icons-react'
import PanelTextSizeSelector from '../common/PanelTextSizeSelector'
import * as Separator from '@radix-ui/react-separator'
import SimpleLexicalCodeSearch from '../lexicon/SimpleLexicalCodeSearch'
import NavigationBar from '../common/NavigationBar'
import BibleSelector from '../bible/BibleSelector'
import PanelVisibilityControls from '../common/PanelVisibilityControls'

export default function MainPageNavigationBar(): JSX.Element {
  return (
    <NavigationBar>
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
          <IconListSearch size={18} />
        </Button>
        <Button
          type="button"
          onClick={() => {
            window.context.openLexiconWindow()
          }}
          size="icon"
        >
          <IconAlphabetHebrew size={18} />
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

      <div className="flex items-center shrink-0 w-fit ml-auto">
        <SimpleLexicalCodeSearch />
      </div>
    </NavigationBar>
  )
}
