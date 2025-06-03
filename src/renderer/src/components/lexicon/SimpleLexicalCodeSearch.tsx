import Button from '../common/Button'
import { IconChevronLeft, IconChevronRight, IconSearch } from '@tabler/icons-react'
import { readWriteLexicalCodeAtom, readWriteLexicalCodeSearchAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import * as Label from '@radix-ui/react-label'

export default function SimpleLexicalCodeSearch(): JSX.Element {
  const [lexicalCode, setLexicalCode] = useAtom(readWriteLexicalCodeAtom)
  const [searchCondition, setSearchCondition] = useAtom(readWriteLexicalCodeSearchAtom)

  const [keyword, setKeyword] = useState<string>(lexicalCode)

  const openInLexiconPage = (keyword: string): void => {
    setSearchCondition({ ...searchCondition, codes: [keyword] })
    window.context.openLexiconWindow(keyword)
  }

  const updateLexicalCode = (direction: 'prev' | 'next'): void => {
    const match = keyword
      .trim()
      .toUpperCase()
      .match(/^([HG])(\d+)$/)
    if (!match) return

    const [_, prefix, numStr] = match
    const num = parseInt(numStr, 10)
    const newNum = direction === 'prev' ? num - 1 : num + 1

    if (newNum < 0) return

    setLexicalCode(`${prefix}${newNum}`)
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setLexicalCode(keyword ? keyword.trim().toUpperCase() : '')
    }
  }

  useEffect(() => {
    setKeyword(lexicalCode)
  }, [lexicalCode])

  return (
    <div className="flex items-center shrink-0 w-fit gap-8pxr">
      <Label.Root className="flex gap-4pxr font-bold" htmlFor="lexical-code">
        <span style={{ fontFamily: 'Noto Serif Hebrew' }}>א</span>
        <span style={{ fontFamily: 'Noto Serif' }}>Ω</span>
      </Label.Root>
      <input
        type="text"
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleEnterKey}
        value={keyword}
        id="lexical-code"
        className="inline-flex justify-center items-center w-80pxr h-32pxr p-4pxr border border-gray-300 rounded-md text-center"
      ></input>
      <Button
        type="button"
        onClick={() => {
          setLexicalCode(keyword ? keyword.trim().toUpperCase() : '')
          if (keyword) {
            openInLexiconPage(keyword)
          }
        }}
        size="icon"
      >
        <IconSearch size={18} />
      </Button>

      <Button type="button" onClick={() => updateLexicalCode('prev')} size="icon">
        <IconChevronLeft size={18} />
      </Button>
      <Button type="button" onClick={() => updateLexicalCode('next')} size="icon">
        <IconChevronRight size={18} />
      </Button>
    </div>
  )
}
