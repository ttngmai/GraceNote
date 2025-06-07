import { panelTitleSizeAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import Modal from './Modal'
import CustomSelect from './CustomSelect'
import tw, { css } from 'twin.macro'
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react'

type PanelTitleSizeModalProps = {
  onClose: () => void
}

export default function PanelTitleSizeModal({ onClose }: PanelTitleSizeModalProps): JSX.Element {
  const [panelTitleSize, setPanelTitleSize] = useAtom(panelTitleSizeAtom)

  const updatePanelTitleSize = (newValues: Partial<typeof panelTitleSize>): void => {
    let newMin = newValues.min ?? panelTitleSize.min
    let newMax = newValues.max ?? panelTitleSize.max

    if (newMin > newMax) {
      ;[newMin, newMax] = [newMax, newMin]
    }

    setPanelTitleSize({ min: newMin, max: newMax })
  }

  return (
    <Modal title="제목 크기 (공통)" onClose={onClose}>
      <div className="flex flex-col justify-center items-center w-300pxr min-h-240pxr p-16pxr bg-white">
        <table css={[contentTableStyle, tw`w-200pxr`]}>
          <tr>
            <th>
              <div className="flex items-center gap-8pxr">
                <IconArrowsMinimize size={18} />
                <span>최소 크기</span>
              </div>
            </th>
            <td>
              <CustomSelect
                value={String(panelTitleSize.min)}
                itemList={Array.from({ length: 17 }, (_, idx) => idx + 4).map((el) => ({
                  key: String(el),
                  value: String(el),
                  text: `${el} pt`
                }))}
                setValue={(value) => updatePanelTitleSize({ min: Number(value) })}
              />
            </td>
          </tr>
          <tr>
            <th>
              <div className="flex items-center gap-8pxr">
                <IconArrowsMaximize size={18} />
                <span>최대 크기</span>
              </div>
            </th>
            <td>
              <CustomSelect
                value={String(panelTitleSize.max)}
                itemList={Array.from({ length: 17 }, (_, idx) => idx + 4).map((el) => ({
                  key: String(el),
                  value: String(el),
                  text: `${el} pt`
                }))}
                setValue={(value) => updatePanelTitleSize({ max: Number(value) })}
              />
            </td>
          </tr>
        </table>
      </div>
    </Modal>
  )
}

const contentTableStyle = css`
  th,
  td {
    ${tw`py-8pxr`}
  }
  td {
    ${tw`flex justify-center items-center`}
  }
`
