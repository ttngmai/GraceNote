import { bibleVerseSearchConditionAtom, bibleVerseSearchResultAtom } from '@renderer/store'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import CustomSelect from '../common/CustomSelect'
import { PANEL_CATEGORIES_AND_VERSIONS } from '@shared/constants'
import { PanelCategory } from '@shared/types'
import BibleRangeSelector from './BibleRangeSelector'
import { IconSearch } from '@tabler/icons-react'
import Button from '../common/Button'

const FIXED_INPUT_COUNT = 3

export default function BibleVerseSearch(): JSX.Element {
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [searchCondition, setSearchCondition] = useAtom(bibleVerseSearchConditionAtom)
  const setBibleVerseSearchResult = useSetAtom(bibleVerseSearchResultAtom)
  const { keywords } = searchCondition

  const [tempSearchCondition, setTempSearchCondition] = useState(searchCondition)
  const { keywords: tempKeywords } = tempSearchCondition

  const handleKeywordChange = (index: number, value: string): void => {
    const updatedKeywords = [...tempKeywords]
    updatedKeywords[index] = value
    setTempSearchCondition({ ...tempSearchCondition, keywords: updatedKeywords })
  }

  const handleSearchBibleVerse = async (): Promise<void> => {
    setSearchCondition(tempSearchCondition)
    const result = await window.context.findKeywordFromBible(tempSearchCondition)
    if (result) {
      setBibleVerseSearchResult(result)
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchBibleVerse()
    }
  }

  useEffect(() => {
    handleSearchBibleVerse()

    setTimeout(() => {
      firstInputRef.current?.focus()
      firstInputRef.current?.select()
    }, 0)
  }, [])

  useEffect(() => {
    if (keywords.length !== FIXED_INPUT_COUNT) {
      const newKeywords = [...keywords]
      while (newKeywords.length < FIXED_INPUT_COUNT) {
        newKeywords.push('')
      }
      setTempSearchCondition({
        ...searchCondition,
        keywords: newKeywords.slice(0, FIXED_INPUT_COUNT)
      })
    }
  }, [keywords, setTempSearchCondition])

  return (
    <>
      <div className="flex flex-col gap-8pxr">
        <div className="flex gap-8pxr">
          <CustomSelect
            value={tempSearchCondition.version}
            itemList={PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.BIBLE].map((version: string) => ({
              key: version,
              value: version,
              text: version
            }))}
            setValue={(value) => setTempSearchCondition({ ...tempSearchCondition, version: value })}
          />
          <BibleRangeSelector
            placeholder="검색 범위 선택"
            initialValue={{
              start: tempSearchCondition.bookRange[0],
              end: tempSearchCondition.bookRange[1]
            }}
            onSelect={(start, end) => {
              setTempSearchCondition({ ...tempSearchCondition, bookRange: [start, end] })
            }}
          />
        </div>

        <div className="flex items-center shrink-0 w-fit gap-8pxr">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              ref={index === 0 ? firstInputRef : undefined}
              type="text"
              value={tempKeywords[index] || ''}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
              onKeyDown={handleEnterKey}
              id={`lexical-code-${index}`}
              className="inline-flex justify-center items-center w-80pxr h-32pxr p-4pxr border border-gray-300 rounded-md text-center"
            ></input>
          ))}
          <Button type="button" onClick={handleSearchBibleVerse} size="icon">
            <IconSearch size={18} />
          </Button>
        </div>
      </div>
    </>
  )
}
