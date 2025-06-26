import { hymnPageViewModeAtom } from '@renderer/store'
import { HymnPageViewMode } from '@shared/types'
import { useAtomValue } from 'jotai'
import HymnScoreViewer from './HymnScoreViewer'
import HymnKeywordViewer from './HymnKeywordViewer'
import HymnListViewer from './HymnListViewer'

export default function HymnViewer(): JSX.Element {
  const hymnPageViewMode = useAtomValue(hymnPageViewModeAtom)

  return <HymnViewerRenderer mode={hymnPageViewMode} />
}

type HymnViewerRendererProps = {
  mode: HymnPageViewMode
}

export const HymnViewerRenderer: React.FC<HymnViewerRendererProps> = ({
  mode
}: HymnViewerRendererProps) => {
  switch (mode) {
    case 'list':
      return <HymnListViewer />
    case 'score':
      return <HymnScoreViewer />
    case 'search':
      return <HymnKeywordViewer />
    default:
      return
  }
}
