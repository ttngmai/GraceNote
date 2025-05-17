import { useEffect } from 'react'

export default function GlobalContextMenu(): JSX.Element | null {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent): void => {
      event.preventDefault()
      const target = event.target as HTMLElement

      if (window.getSelection()?.toString()) {
        window.electron.menu.showContextMenu('copyable-text')
      } else if (target instanceof HTMLImageElement) {
        window.electron.menu.showContextMenu('copyable-image', target.src)
      } else if (target instanceof HTMLInputElement && target.type === 'text') {
        window.electron.menu.showContextMenu('text-input')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return null
}
