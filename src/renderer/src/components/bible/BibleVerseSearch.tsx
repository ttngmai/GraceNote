import { bibleVerseSearchParamsAtom, bibleVerseSearchResultAtom } from '@renderer/store'
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

  const [searchParams, setSearchParams] = useAtom(bibleVerseSearchParamsAtom)
  const setBibleVerseSearchResult = useSetAtom(bibleVerseSearchResultAtom)
  const { keywords } = searchParams

  const [tempSearchParams, setTempSearchParams] = useState(searchParams)
  const { keywords: tempKeywords } = tempSearchParams

  const handleKeywordChange = (index: number, value: string): void => {
    const updatedKeywords = [...tempKeywords]
    updatedKeywords[index] = value
    setTempSearchParams({ ...tempSearchParams, keywords: updatedKeywords })
  }

  const handleSearchBibleVerse = async (): Promise<void> => {
    setSearchParams(tempSearchParams)
    const result = await window.context.findKeywordFromBible(tempSearchParams)
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
      setTempSearchParams({
        ...searchParams,
        keywords: newKeywords.slice(0, FIXED_INPUT_COUNT)
      })
    }
  }, [keywords, setTempSearchParams])

  return (
    <>
      <div className="flex flex-col gap-8pxr">
        <div className="flex gap-8pxr">
          <CustomSelect
            value={tempSearchParams.version}
            itemList={PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.BIBLE].map((version: string) => ({
              key: version,
              value: version,
              text: version
            }))}
            setValue={(value) => setTempSearchParams({ ...tempSearchParams, version: value })}
          />
          <BibleRangeSelector
            placeholder="검색 범위 선택"
            initialValue={{
              start: tempSearchParams.bookRange[0],
              end: tempSearchParams.bookRange[1]
            }}
            onSelect={(start, end) => {
              setTempSearchParams({ ...tempSearchParams, bookRange: [start, end] })
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
