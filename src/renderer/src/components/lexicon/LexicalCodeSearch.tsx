import { lexicalCodeSearchParamsAtom, lexicalCodeSearchResultAtom } from '@renderer/store'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import Button from '../common/Button'
import { IconSearch } from '@tabler/icons-react'
import CustomSelect from '../common/CustomSelect'
import { PANEL_CATEGORIES_AND_VERSIONS } from '@shared/constants'
import { FindLexicalCodeFromBibleParams, PanelCategory } from '@shared/types'
import BibleRangeSelector from '../bible/BibleRangeSelector'

const FIXED_INPUT_COUNT = 3

export default function LexicalCodeSearch(): JSX.Element {
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [searchParams, setSearchParams] = useAtom(lexicalCodeSearchParamsAtom)
  const setLexicalCodeSearchResult = useSetAtom(lexicalCodeSearchResultAtom)
  const { codes } = searchParams

  const [tempSearchParams, setTempSearchParams] = useState({ ...searchParams })

  const handleCodeChange = (index: number, value: string): void => {
    const updatedCodes = [...tempSearchParams.codes]
    updatedCodes[index] = value.trim().toUpperCase()
    setTempSearchParams({ ...tempSearchParams, codes: updatedCodes })
  }

  const handleSearchLexicalCode = async (
    condition: FindLexicalCodeFromBibleParams
  ): Promise<void> => {
    setSearchParams(condition)
    const result = await window.context.findLexicalCodeFromBible(condition)
    if (result) {
      setLexicalCodeSearchResult(result)
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchLexicalCode(tempSearchParams)
    }
  }

  useEffect(() => {
    window.context.onUpdateLexicalCode((keyword: string) => {
      setTempSearchParams((prev) => {
        const condition = {
          ...prev,
          codes: keyword ? [keyword] : prev.codes
        }

        handleSearchLexicalCode(condition)

        setTimeout(() => {
          firstInputRef.current?.focus()
          firstInputRef.current?.select()
        }, 0)

        return condition
      })
    })
  }, [])

  useEffect(() => {
    if (codes.length !== FIXED_INPUT_COUNT) {
      const newCodes = [...codes]
      while (newCodes.length < FIXED_INPUT_COUNT) {
        newCodes.push('')
      }
      setTempSearchParams({
        ...tempSearchParams,
        codes: newCodes.slice(0, FIXED_INPUT_COUNT)
      })
    }
  }, [codes, setTempSearchParams])

  return (
    <>
      <div className="flex flex-col gap-8pxr">
        <div className="flex gap-8pxr">
          <CustomSelect
            value={tempSearchParams.version}
            itemList={PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.CODED_BIBLE].map(
              (version: string) => ({
                key: version,
                value: version,
                text: version
              })
            )}
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
              value={tempSearchParams.codes[index] || ''}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={handleEnterKey}
              id={`lexical-code-${index}`}
              className="inline-flex justify-center items-center w-80pxr h-32pxr p-4pxr border border-gray-300 rounded-md text-center"
            ></input>
          ))}
          <Button
            type="button"
            onClick={() => handleSearchLexicalCode(tempSearchParams)}
            size="icon"
          >
            <IconSearch size={18} />
          </Button>
        </div>
      </div>
    </>
  )
}
