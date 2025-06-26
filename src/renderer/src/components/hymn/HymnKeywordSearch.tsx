import { hymnPageViewModeAtom, hymnSearchParamsAtom, hymnSearchResultAtom } from '@renderer/store'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import Button from '../common/Button'
import { IconSearch } from '@tabler/icons-react'

const FIXED_INPUT_COUNT = 3

export default function HymnKeywordSearch(): JSX.Element {
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [searchParams, setSearchParams] = useAtom(hymnSearchParamsAtom)
  const setHymnSearchResult = useSetAtom(hymnSearchResultAtom)
  const [hymnPageViewMode, setHymnPageViewModeAtom] = useAtom(hymnPageViewModeAtom)
  const { keywords } = searchParams

  const [tempSearchParams, setTempSearchParams] = useState(searchParams)
  const { keywords: tempKeywords } = tempSearchParams

  const handleKeywordChange = (index: number, value: string): void => {
    const updatedKeywords = [...tempKeywords]
    updatedKeywords[index] = value
    setTempSearchParams({ ...tempSearchParams, keywords: updatedKeywords })
  }

  const handleSearchHymn = async (): Promise<void> => {
    setSearchParams(tempSearchParams)
    const result = await window.context.findKeywordFromHymn(tempSearchParams)
    if (result) {
      setHymnSearchResult(result)
      setHymnPageViewModeAtom('search')
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchHymn()
    }
  }

  useEffect(() => {
    if (hymnPageViewMode !== 'search') return

    handleSearchHymn()

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
      <Button type="button" onClick={handleSearchHymn} size="icon">
        <IconSearch size={18} />
      </Button>
    </div>
  )
}
