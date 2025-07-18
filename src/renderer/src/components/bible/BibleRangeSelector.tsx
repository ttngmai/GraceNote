import { BOOK_INFO } from '@shared/constants'
import { useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import tw from 'twin.macro'
import Button from '../common/Button'

type BibleRangeSelectorProps = {
  placeholder?: string
  initialValue?: { start: number; end: number }
  onSelect: (start: number, end: number) => void
}

export default function BibleRangeSelector({
  placeholder,
  initialValue,
  onSelect
}: BibleRangeSelectorProps): JSX.Element {
  const [start, setStart] = useState<number | null>(initialValue?.start || null)
  const [end, setEnd] = useState<number | null>(initialValue?.end || null)
  const [openBookSelector, setOpenBookSelector] = useState(false)

  const handleSelect = (value: number): void => {
    if (start && end) {
      setStart(value)
      setEnd(null)
    } else if (start) {
      if (start <= value) {
        setEnd(value)
      } else {
        setStart(value)
        setEnd(start)
      }
      setOpenBookSelector(false)
    } else {
      setStart(value)
    }
  }

  useEffect(() => {
    if (start && end) {
      onSelect(start, end)
    }
  }, [start, end])

  return (
    <div className="flex items-center gap-8pxr">
      <div className="flex">
        <Button
          type="button"
          onClick={() => {
            setStart(1)
            setEnd(66)
          }}
          variant="outline"
          sx={
            start === 1 && end === 66
              ? tw`w-40pxr rounded-r-none border-r-0 bg-amber-100 hover:bg-amber-200 font-bold text-brand-blue-500`
              : tw`w-40pxr rounded-r-none border-r-0 bg-amber-100 hover:bg-amber-200`
          }
        >
          전체
        </Button>
        <Button
          type="button"
          onClick={() => {
            setStart(1)
            setEnd(39)
          }}
          variant="outline"
          sx={
            start === 1 && end === 39
              ? tw`w-40pxr rounded-none bg-green-100 hover:bg-green-200 font-bold text-brand-blue-500`
              : tw`w-40pxr rounded-none bg-green-100 hover:bg-green-200`
          }
        >
          구약
        </Button>
        <Button
          type="button"
          onClick={() => {
            setStart(40)
            setEnd(66)
          }}
          variant="outline"
          sx={
            start === 40 && end === 66
              ? tw`w-40pxr rounded-l-none border-l-0 bg-red-100 hover:bg-red-200 font-bold text-brand-blue-500`
              : tw`w-40pxr rounded-l-none border-l-0 bg-red-100 hover:bg-red-200`
          }
        >
          신약
        </Button>
      </div>

      <Popover.Root open={openBookSelector} onOpenChange={setOpenBookSelector}>
        <Popover.Trigger className="h-32pxr px-8pxr py-4pxr border border-gray-300 text-[14px] rounded-md shadow-sm">
          {start === null || end === null ? (
            placeholder ? (
              placeholder
            ) : (
              '범위 선택'
            )
          ) : (
            <>
              <span className="font-bold text-brand-blue-500">
                {BOOK_INFO.find((el) => el.id === start)?.name}
              </span>
              <span>~</span>
              <span className="font-bold text-brand-blue-500">
                {BOOK_INFO.find((el) => el.id === end)?.name}
              </span>
            </>
          )}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            className="flex max-h-384pxr border border-gray-300 bg-white rounded-md shadow-sm overflow-hidden"
            style={{
              height: 'calc(var(--radix-popover-content-available-height) - 16px)'
            }}
          >
            <div className="flex flex-col w-300pxr">
              <div className="flex items-center h-32pxr px-8pxr py-4pxr border-b border-b-gray-300 font-bold text-[14px]">
                <p className="flex-1">구약</p>
                <p className="flex-1">신약</p>
              </div>
              <div className="flex h-[calc(100%-32px)]">
                <ul className="flex-1 overflow-y-auto scroll-hidden">
                  {BOOK_INFO.slice(0, 39).map((el) => (
                    <li
                      key={el.id}
                      onClick={() => {
                        handleSelect(el.id)
                      }}
                      className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer"
                      css={[
                        (start && end && start <= el.id && el.id <= end) || start === el.id
                          ? tw`bg-indigo-200 font-bold`
                          : tw`hover:bg-[#F8FAFC]`
                      ]}
                    >
                      <span>{el.name}</span>
                    </li>
                  ))}
                </ul>
                <ul className="flex-1 overflow-y-auto scroll-hidden">
                  {BOOK_INFO.slice(39).map((el) => (
                    <li
                      key={el.id}
                      onClick={() => {
                        handleSelect(el.id)
                      }}
                      className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer"
                      css={[
                        (start && end && start <= el.id && el.id <= end) || start === el.id
                          ? tw`bg-indigo-200 font-bold`
                          : tw`hover:bg-[#F8FAFC]`
                      ]}
                    >
                      <span>{el.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Popover.Arrow className="fill-gray-300" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
