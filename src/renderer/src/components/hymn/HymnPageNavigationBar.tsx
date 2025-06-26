import { useEffect, useState } from 'react'
import NavigationBar from '../common/NavigationBar'
import HymnPlayer from './HymnPlayer'
import HymnNumberSearch from './HymnNumberSearch'
import { useAtomValue } from 'jotai'
import { hymnAtom, scoreViewModeAtom } from '@renderer/store'
import * as Separator from '@radix-ui/react-separator'

import HymnTextSizeSelector from './HymnTextSizeSelector'
import tw from 'twin.macro'
import HymnKeywordSearch from './HymnKeywordSearch'
import ScoreViewModeToggleButton from './ScoreViewModeToggleButton'

export default function HymnPageNavigation(): JSX.Element {
  const hymn = useAtomValue(hymnAtom)
  const scoreViewMode = useAtomValue(scoreViewModeAtom)

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
    <NavigationBar sx={tw`h-110pxr`}>
      <div className="flex flex-col gap-8pxr h-full">
        <div className="flex items-center">
          <HymnNumberSearch />

          <Separator.Root
            className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
            decorative
            orientation="vertical"
          />

          <div className="flex items-center shrink-0 w-250pxr h-40pxr mt-8pxr">
            <HymnPlayer url={hymnAudioPath} playbackRate={1.0} />
          </div>

          <div className="flex items-center shrink-0 gap-8pxr w-fit ml-16pxr">
            <ScoreViewModeToggleButton />
            {scoreViewMode === 'textMode' && <HymnTextSizeSelector />}
          </div>
        </div>

        <div className="flex">
          <HymnKeywordSearch />
        </div>
      </div>
    </NavigationBar>
  )
}
