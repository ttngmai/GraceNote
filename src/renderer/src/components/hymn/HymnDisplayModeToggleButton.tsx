import { hymnDisplayModeAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import Button from '../common/Button'
import { HymnDisplayMode } from '@shared/types'

export default function HymnDisplayModeToggleButton(): JSX.Element {
  const [hymnDisplayMode, setHymnDisplayMode] = useAtom(hymnDisplayModeAtom)

  const handleToggleHymnDisplayMode = (mode: HymnDisplayMode): void => {
    switch (mode) {
      case 'scoreMode':
        setHymnDisplayMode('lyricsMode')
        break
      case 'lyricsMode':
        setHymnDisplayMode('scoreMode')
        break
      default:
        return
    }
  }

  return (
    <Button
      type="button"
      onClick={() => {
        handleToggleHymnDisplayMode(hymnDisplayMode)
      }}
    >
      {hymnDisplayMode === 'scoreMode' ? '가사' : '악보'}
    </Button>
  )
}
