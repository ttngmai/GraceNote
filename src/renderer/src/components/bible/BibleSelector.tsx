import { BIBLE_COUNT_INFO, BOOK_INFO } from '@shared/constants'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { bookAtom, chapterAtom } from '@renderer/store'
import useSearchBible from '@renderer/hooks/useSearchBible'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import CustomSelect from '../common/CustomSelect'
import * as Popover from '@radix-ui/react-popover'
import Button from '../common/Button'

export default function BibleSelector(): JSX.Element {
  const book = useAtomValue(bookAtom)
  const chapter = useAtomValue(chapterAtom)

  const [lastChapter, setLastChapter] = useState<number>(0)
  const [openBookSelector, setOpenBookSelector] = useState(false)

  const bookName = BOOK_INFO.find((el) => el.id === book)?.name

  const searchBible = useSearchBible()

  useEffect(() => {
    setLastChapter(
      BIBLE_COUNT_INFO.filter((el) => el.book === book)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0
    )
  }, [book])

  return (
    <div className="flex items-center gap-8pxr mx-auto">
      <Popover.Root open={openBookSelector} onOpenChange={setOpenBookSelector}>
        <Popover.Trigger>
          <span className="font-bold text-brand-blue-500">{bookName}</span>
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
                        searchBible(el.id, 1, 1)
                        setOpenBookSelector(false)
                      }}
                      className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:font-bold hover:bg-[#F8FAFC]"
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
                        searchBible(el.id, 1, 1)
                        setOpenBookSelector(false)
                      }}
                      className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:font-bold hover:bg-[#F8FAFC]"
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
      <div className="flex items-center">
        <Button
          type="button"
          onClick={() => searchBible(book, chapter - 1, 1)}
          size="icon"
          disabled={chapter <= 1}
        >
          <IconArrowLeft size={18} />
        </Button>
        <CustomSelect
          itemList={BIBLE_COUNT_INFO.filter((el) => el.book === book).map((el) => ({
            key: String(el.chapter),
            value: String(el.chapter),
            text: `${el.chapter}${el.book !== 19 ? '장' : '편'}`
          }))}
          value={String(chapter)}
          setValue={(value) => searchBible(book, Number(value), 1)}
        >
          <div className="flex justify-center items-center mx-8pxr font-bold">
            <span className="text-brand-blue-500">
              {chapter}
              {book !== 19 ? '장' : '편'}
            </span>
            <span className="mx-8pxr">/</span>
            <span>
              {lastChapter}
              {book !== 19 ? '장' : '편'}
            </span>
          </div>
        </CustomSelect>
        <Button
          type="button"
          onClick={() => searchBible(book, chapter + 1, 1)}
          size="icon"
          disabled={chapter === lastChapter}
        >
          <IconArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
