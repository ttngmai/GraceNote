import { hymnAtom, hymnTextSizeAtom, scoreViewModeAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

export default function HymnScoreViewer(): JSX.Element {
  const hymn = useAtomValue(hymnAtom)
  const scoreViewMode = useAtomValue(scoreViewModeAtom)
  const hymnTextSize = useAtomValue(hymnTextSizeAtom)

  const [hymnSheetPath, setHymnSheetPath] = useState<string>()

  useEffect(() => {
    if (hymn == null) {
      return
    }

    ;(async (): Promise<void> => {
      const hymnSheetPath = await window.context.getImageFilePath(`hymn/${hymn.hymn_number}.png`)
      setHymnSheetPath(hymnSheetPath || '')
    })()
  }, [hymn])

  return (
    <div className="flex justify-center w-full m-16pxr">
      {scoreViewMode === 'imageMode' && (
        <div className="p-16pxr">
          <img src={hymnSheetPath} className="w-full max-w-800pxr mx-auto object-cover" />
        </div>
      )}
      {scoreViewMode === 'textMode' && hymn && (
        <div className={`w-fit p-16pxr mx-auto text-[${hymnTextSize}px]`}>
          <p className="font-bold text-brand-blue-500 ">{`${hymn.hymn_number}. ${hymn.title}`}</p>
          <br />
          <LyricsRenderer lyrics={hymn.lyrics} />
        </div>
      )}
    </div>
  )
}

type LyricsRendererProps = {
  lyrics: string
}

export const LyricsRenderer: React.FC<LyricsRendererProps> = ({ lyrics }: LyricsRendererProps) => {
  if (!lyrics) return null

  const lines = lyrics.split('\n')

  return (
    <div>
      {lines.map((line, index) => {
        const trimmedLine = line.trim()

        if (trimmedLine === '') {
          return <br key={index} />
        }

        const isSectionHeader = /^(후렴|\d+절)/.test(trimmedLine)

        return <p key={index}>{isSectionHeader ? <b>{trimmedLine}</b> : trimmedLine}</p>
      })}
    </div>
  )
}
