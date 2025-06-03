import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { IconChevronRight } from '@tabler/icons-react'
import { PanelCategory } from '@shared/types'
import { TwStyle } from 'twin.macro'
import { useAtom } from 'jotai'
import { PANEL_CATEGORIES_AND_VERSIONS } from '@shared/constants'
import { panelGridAtom } from '@renderer/store'
import { Textfit } from 'react-textfit'

type PanelCategorySelectorProps = {
  panelId: string
  placeholder?: string
  sx?: TwStyle
}

export default function PanelCategorySelector({
  panelId,
  placeholder,
  sx
}: PanelCategorySelectorProps): JSX.Element {
  const [panelGrid, setPanelGrid] = useAtom(panelGridAtom)

  const selectPanelCategoryAndVersion = (
    id: string,
    newCategory: PanelCategory,
    newVersion: string
  ): void => {
    const newSettings = { ...panelGrid.settings }
    if (newSettings[id]) {
      newSettings[id] = {
        ...newSettings[id],
        category: newCategory,
        version: newVersion
      }
      setPanelGrid({ ...panelGrid, settings: newSettings })
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger css={[sx]}>
        <Textfit mode="single" min={8} max={14}>
          {placeholder || '없음'}
        </Textfit>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm"
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold">
              성경
              <IconChevronRight size={14} className="ml-auto" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm">
                {PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.BIBLE].map((bible) => (
                  <DropdownMenu.Item
                    key={bible}
                    onSelect={() => {
                      selectPanelCategoryAndVersion(panelId, PanelCategory.BIBLE, bible)
                    }}
                    className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold"
                  >
                    {bible}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold">
              주석
              <IconChevronRight size={14} className="ml-auto" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm">
                {PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.COMMENTARY].map((commentary) => (
                  <DropdownMenu.Item
                    key={commentary}
                    onSelect={() => {
                      selectPanelCategoryAndVersion(panelId, PanelCategory.COMMENTARY, commentary)
                    }}
                    className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold"
                  >
                    {commentary}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold">
              코드역본
              <IconChevronRight size={14} className="ml-auto" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm">
                {PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.CODED_BIBLE].map((codedBible) => (
                  <DropdownMenu.Item
                    key={codedBible}
                    onSelect={() => {
                      selectPanelCategoryAndVersion(panelId, PanelCategory.CODED_BIBLE, codedBible)
                    }}
                    className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold"
                  >
                    {codedBible}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold">
              원어사전
              <IconChevronRight size={14} className="ml-auto" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="w-120pxr border border-gray-300 bg-white rounded-md shadow-sm">
                {PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.LEXICON].map((lexicon) => (
                  <DropdownMenu.Item
                    key={lexicon}
                    onSelect={() => {
                      selectPanelCategoryAndVersion(panelId, PanelCategory.LEXICON, lexicon)
                    }}
                    className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold"
                  >
                    {lexicon}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Item
            onSelect={() => {
              selectPanelCategoryAndVersion(panelId, PanelCategory.NONE, '')
            }}
            className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:bg-[#F8FAFC] hover:font-bold"
          >
            없음
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
