import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { IconMenu2 } from '@tabler/icons-react'
import Button from './Button'
import tw from 'twin.macro'
import { useAtom } from 'jotai'
import { useState } from 'react'
import ModalPortal from '@renderer/utils/ModalPortal'
import PanelStylesModal from './PanelStylesModal'
import { readWritePanelGridAtom } from '@renderer/store'
import { mergePanels, unmergePanel } from '@renderer/utils/panelUtils'

type PanelSettingsDropdownProps = {
  panelId: string
}

export default function PanelSettingsDropdown({
  panelId
}: PanelSettingsDropdownProps): JSX.Element {
  const [panelGrid, setPanelGrid] = useAtom(readWritePanelGridAtom)
  const panel = panelGrid.panels.find((p) => p.id === panelId)
  const settings = panelGrid.settings[panelId]

  const [openStylesModal, setOpenStylesModal] = useState<boolean>(false)

  const toggleBasePanel = (id: string): void => {
    const newSettings = Object.fromEntries(
      Object.entries(panelGrid.settings).map(([key, setting]) => [
        key,
        { ...setting, isBase: key === id ? !setting.isBase : false }
      ])
    )
    setPanelGrid({ ...panelGrid, settings: newSettings })
  }

  const handleMerge = (id: string): void => {
    const basePanel = panelGrid.panels.find((p) => p.id === id)
    if (!basePanel) return

    const mergeTarget = panelGrid.panels.filter((p) => p.col === basePanel.col)
    if (mergeTarget.length < 2) return

    const rows = mergeTarget.map((p) => p.row)
    const cols = mergeTarget.map((p) => p.col)
    const range = {
      startRow: Math.min(...rows),
      endRow: Math.max(...rows),
      startCol: Math.min(...cols),
      endCol: Math.max(...cols)
    }

    const merged = mergePanels(panelGrid.panels, basePanel.id, range)
    setPanelGrid({ ...panelGrid, panels: merged })
  }

  const handleUnmerge = (id: string): void => {
    const basePanel = panelGrid.panels.find((p) => p.id === id)
    if (!basePanel || basePanel.state !== 'master') return

    const unmerged = unmergePanel(panelGrid.panels, basePanel.id)
    setPanelGrid({ ...panelGrid, panels: unmerged })
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button type="button" variant="ghost" size="icon" sx={tw`shrink-0`}>
            <IconMenu2 size={14} />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={5}
            className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm"
          >
            <DropdownMenu.Item
              onSelect={() => {
                toggleBasePanel(panelId)
              }}
              css={dropdownMenuItemStyle}
            >
              {!settings.isBase ? '기준으로 지정' : '기준 지정 해제'}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                setOpenStylesModal(true)
              }}
              css={dropdownMenuItemStyle}
            >
              배경·글자 색
            </DropdownMenu.Item>
            {panel?.state === 'normal' && (
              <DropdownMenu.Item
                onSelect={() => {
                  handleMerge(panelId)
                }}
                css={dropdownMenuItemStyle}
              >
                합치기
              </DropdownMenu.Item>
            )}
            {panel?.state === 'master' && (
              <DropdownMenu.Item
                onSelect={() => {
                  handleUnmerge(panelId)
                }}
                css={dropdownMenuItemStyle}
              >
                나누기
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {openStylesModal && (
        <ModalPortal>
          <PanelStylesModal panelId={panelId} onClose={() => setOpenStylesModal(false)} />
        </ModalPortal>
      )}
    </>
  )
}

const dropdownMenuItemStyle = tw`flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold`
