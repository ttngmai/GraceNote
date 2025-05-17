import HymnPageNavigation from '@renderer/components/hymn/HymnPageNavigationBar'
import HymnViewer from '@renderer/components/hymn/HymnViewer'

export default function HymnPage(): JSX.Element {
  return (
    <>
      <HymnPageNavigation />

      <div className="h-[calc(100vh-60px)] m-16pxr">
        <HymnViewer />
      </div>
    </>
  )
}
