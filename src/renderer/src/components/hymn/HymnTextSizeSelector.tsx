import { IconTextSize } from '@tabler/icons-react'
import CustomSelect from '../common/CustomSelect'
import { useAtom } from 'jotai'
import { readWriteHymnTextSizeAtom } from '@renderer/store'
import Button from '../common/Button'

export default function HymnTextSizeSelector(): JSX.Element {
  const [hymnTextSize, setHymnTextSize] = useAtom(readWriteHymnTextSizeAtom)

  return (
    <div className="flex items-center shrink-0 w-fit gap-8pxr">
      <CustomSelect
        value={String(hymnTextSize)}
        itemList={Array.from({ length: 21 }, (_, idx) => idx + 10).map((el) => ({
          key: String(el),
          value: String(el),
          text: `${el} pt`
        }))}
        setValue={(value) => setHymnTextSize(Number(value))}
      >
        <Button type="button" size="icon">
          <IconTextSize size={18} />
        </Button>
      </CustomSelect>
    </div>
  )
}
