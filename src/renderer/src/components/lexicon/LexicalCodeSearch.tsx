import {
  readWriteLexicalCodeSearchResultAtom,
  readWriteLexicalCodeSearchAtom
} from '@renderer/store'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import Button from '../common/Button'
import { IconSearch } from '@tabler/icons-react'
import CustomSelect from '../common/CustomSelect'
import { PANEL_CATEGORIES_AND_VERSIONS } from '@shared/constants'
import { PanelCategory } from '@shared/types'
import BibleRangeSelector from '../bible/BibleRangeSelector'

const FIXED_INPUT_COUNT = 3

export default function LexicalCodeSearch(): JSX.Element {
  const [searchCondition, setSearchCondition] = useAtom(readWriteLexicalCodeSearchAtom)
  const setLexicalCodeSearchResult = useSetAtom(readWriteLexicalCodeSearchResultAtom)
  const { codes } = searchCondition

  const [tempSearchCondition, setTempSearchCondition] = useState(searchCondition)
  const { codes: tempCodes } = tempSearchCondition

  const handleCodeChange = (index: number, value: string): void => {
    const updatedCodes = [...tempCodes]
    updatedCodes[index] = value.trim().toUpperCase()
    setTempSearchCondition({ ...tempSearchCondition, codes: updatedCodes })
  }

  const handleSearchLexicalCode = async (): Promise<void> => {
    setSearchCondition(tempSearchCondition)
    const result = await window.context.findLexicalCodeFromBible(tempSearchCondition)
    if (result) {
      setLexicalCodeSearchResult(result)
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchLexicalCode()
    }
  }

  useEffect(() => {
    handleSearchLexicalCode()
  }, [])

  useEffect(() => {
    if (codes.length !== FIXED_INPUT_COUNT) {
      const newCodes = [...codes]
      while (newCodes.length < FIXED_INPUT_COUNT) {
        newCodes.push('')
      }
      setTempSearchCondition({ ...searchCondition, codes: newCodes.slice(0, FIXED_INPUT_COUNT) })
    }
  }, [codes, setTempSearchCondition])

  return (
    <>
      <div className="flex flex-col gap-8pxr">
        <div className="flex gap-8pxr">
          <CustomSelect
            value={tempSearchCondition.version}
            itemList={PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.CODED_BIBLE].map(
              (version: string) => ({
                key: version,
                value: version,
                text: version
              })
            )}
            setValue={(value) => setTempSearchCondition({ ...tempSearchCondition, version: value })}
          />
          <BibleRangeSelector
            placeholder="검색 범위 선택"
            onSelect={(start, end) => {
              setTempSearchCondition({ ...tempSearchCondition, bookRange: [start, end] })
            }}
          />
        </div>

        <div className="flex items-center shrink-0 w-fit gap-8pxr">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="text"
              value={tempCodes[index] || ''}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={handleEnterKey}
              id={`lexical-code-${index}`}
              className="inline-flex justify-center items-center w-80pxr h-32pxr p-4pxr border border-gray-300 rounded-md text-center"
            ></input>
          ))}
          <Button type="button" onClick={handleSearchLexicalCode} size="icon">
            <IconSearch size={18} />
          </Button>
        </div>
      </div>
    </>
  )
}
