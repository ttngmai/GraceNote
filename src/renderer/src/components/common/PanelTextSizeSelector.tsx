import { useAtom } from 'jotai'
import { readWritePanelTextSizeAtom } from '@renderer/store'
import { IconTextSize } from '@tabler/icons-react'
import CustomSelect from './CustomSelect'
import Button from './Button'

export default function PanelTextSizeSelector(): JSX.Element {
  const [panelTextSize, setPanelTextSize] = useAtom(readWritePanelTextSizeAtom)

  return (
    <CustomSelect
      value={String(panelTextSize)}
      itemList={Array.from({ length: 21 }, (_, idx) => idx + 10).map((el) => ({
        key: String(el),
        value: String(el),
        text: `${el} pt`
      }))}
      setValue={(value) => setPanelTextSize(Number(value))}
    >
      <Button type="button" size="icon">
        <IconTextSize size={18} />
      </Button>
    </CustomSelect>
  )
}
