import { useAtom } from 'jotai'
import { readWritePanelTextSizeAtom } from '@renderer/store'
import CustomSelect from './CustomSelect'

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
    />
  )
}
