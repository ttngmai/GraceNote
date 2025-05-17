import { useEffect, useState } from 'react'
import NavigationBar from '../common/NavigationBar'
import HymnPlayer from './HymnPlayer'
import * as Separator from '@radix-ui/react-separator'
import HymnSearch from './HymnSearch'
import { useAtomValue } from 'jotai'
import { readWriteHymnAtom, readWriteHymnDisplayModeAtom } from '@renderer/store'
import HymnDisplayModeToggleButton from './HymnDisplayModeToggleButton'
import HymnTextSizeSelector from './HymnTextSizeSelector'

export default function HymnPageNavigation(): JSX.Element {
  const hymn = useAtomValue(readWriteHymnAtom)
  const hymnDisplayMode = useAtomValue(readWriteHymnDisplayModeAtom)

  const [hymnAudioPath, setHymnAudioPath] = useState<string>('')

  useEffect(() => {
    if (hymn == null) {
      return
    }

    ;(async (): Promise<void> => {
      const hymnAudioPath = await window.context.getAudioFilePath(`hymn/${hymn.hymn_number}.mp3`)
      setHymnAudioPath(hymnAudioPath || '')
    })()
  }, [hymn])

  return (
    <NavigationBar>
      <div className="flex items-center shrink-0 w-250pxr h-40pxr mt-8pxr">
        <HymnPlayer url={hymnAudioPath} playbackRate={1.0} />
      </div>

      <Separator.Root
        className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
        decorative
        orientation="vertical"
      />

      <HymnSearch />

      <Separator.Root
        className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
        decorative
        orientation="vertical"
      />

      <div className="flex items-center shrink-0 gap-8pxr w-fit">
        <HymnDisplayModeToggleButton />
        {hymnDisplayMode === 'lyricsMode' && <HymnTextSizeSelector />}
      </div>
    </NavigationBar>
  )
}
