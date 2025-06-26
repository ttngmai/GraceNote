import { scoreViewModeAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import Button from '../common/Button'
import { ScoreViewMode } from '@shared/types'

export default function ScoreViewModeToggleButton(): JSX.Element {
  const [scoreViewMode, setScoreViewMode] = useAtom(scoreViewModeAtom)

  const handleToggleScoreViewMode = (mode: ScoreViewMode): void => {
    switch (mode) {
      case 'imageMode':
        setScoreViewMode('textMode')
        break
      case 'textMode':
        setScoreViewMode('imageMode')
        break
      default:
        return
    }
  }

  return (
    <Button
      type="button"
      onClick={() => {
        handleToggleScoreViewMode(scoreViewMode)
      }}
    >
      {scoreViewMode === 'imageMode' ? '가사' : '악보'}
    </Button>
  )
}
