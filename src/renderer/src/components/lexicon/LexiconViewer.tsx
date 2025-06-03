import { lexicalCodeSearchConditionAtom, lexicalCodeSearchResultAtom } from '@renderer/store'
import { BOOK_INFO } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import tw, { TwStyle } from 'twin.macro'
import Pagination from '../common/Pagination'
import { useEffect, useRef, useState } from 'react'
import { TBible } from '@shared/models'
import { formatNumberWithComma } from '@renderer/utils/numberFormat'

export default function LexiconViewer(): JSX.Element {
  const keywordMatchedVersesScrollRef = useRef<HTMLDivElement>(null)
  const fullChaptersWithKeywordScrollRef = useRef<HTMLDivElement>(null)

  const searchCondition = useAtomValue(lexicalCodeSearchConditionAtom)
  const { version, bookRange, codes } = searchCondition
  const [lexicalCodeSearchResult, setLexicalCodeSearchResult] = useAtom(lexicalCodeSearchResultAtom)
  const {
    data: keywordMatchedVerses,
    totalCount,
    totalPages,
    currentPage
  } = lexicalCodeSearchResult

  const [selectedBible, setSelectedBible] = useState<{
    version: string
    book: number
    chapter: number
    verse: number
  } | null>(null)
  const [bibleData, setBibleData] = useState<TBible[]>()
  const [bibleDataVersion, setBibleDataVersion] = useState<string>('')

  // 각 절 렌더링
  const renderVerseList = (): JSX.Element[] | null => {
    if (!keywordMatchedVerses) return null

    return keywordMatchedVerses.map(({ book, chapter, verse, btext }) => (
      <KeywordMatchedVersesItem
        key={`${book}-${chapter}-${verse}`}
        version={version}
        book={book}
        chapter={chapter}
        verse={verse}
        btext={btext}
        codes={codes}
        isLight={true}
        onLabelClick={(version, book, chapter, verse) => {
          setSelectedBible({ version, book, chapter, verse })
        }}
      />
    ))
  }

  const handlePageChange = async (page: number): Promise<void> => {
    const result = await window.context.findLexicalCodeFromBible({ ...searchCondition, page })
    if (result) {
      setLexicalCodeSearchResult(result)
    }
  }

  useEffect(() => {
    if (keywordMatchedVersesScrollRef.current) {
      keywordMatchedVersesScrollRef.current.scrollTop = 0
    }
  }, [lexicalCodeSearchResult])

  useEffect(() => {
    if (selectedBible == null) {
      return
    }

    ;(async (): Promise<void> => {
      const result = await window.context.findBible(
        selectedBible.version,
        selectedBible.book,
        selectedBible.chapter
      )
      setBibleDataVersion(selectedBible.version)
      setBibleData(result)
    })()
  }, [selectedBible])

  useEffect(() => {
    if (!bibleData || !selectedBible || !fullChaptersWithKeywordScrollRef.current) return

    const selector = `[data-verse="${selectedBible.verse}"]`
    const targetElement = fullChaptersWithKeywordScrollRef.current.querySelector(selector)

    if (targetElement) {
      targetElement.scrollIntoView(true)
    }
  }, [bibleData])

  return (
    <div className="flex w-full">
      <div
        ref={keywordMatchedVersesScrollRef}
        className="flex-1 p-16pxr overflow-y-auto bg-emerald-100"
      >
        {searchCondition && (
          <div className="flex flex-col mb-16pxr">
            <div>
              ◆ {BOOK_INFO.find((el) => el.id === bookRange[0])?.shortName || ''}
              {' ~ '}
              {BOOK_INFO.find((el) => el.id === bookRange[1])?.shortName || ''} {`(${version})`}
              {' : '}
              {formatNumberWithComma(totalCount)} 구절
            </div>
            <div className="flex gap-[0.25em]">
              ◎
              {codes
                .filter((code) => code.trim() !== '')
                .map((code) => code.trim().toUpperCase())
                .map((code, index) => (
                  <span key={code} css={[getHighlightColor(index, true), tw`font-bold`]}>
                    {code}
                  </span>
                ))}
            </div>
          </div>
        )}
        {renderVerseList()}
        <div className="sticky -bottom-16pxr flex justify-center -mx-16pxr -mb-16pxr py-8pxr bg-emerald-100">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div
        ref={fullChaptersWithKeywordScrollRef}
        className="flex-1 p-16pxr overflow-y-auto bg-amber-100"
      >
        {bibleData
          ? bibleData.map(({ book, chapter, verse, btext }) => (
              <FullChaptersWithKeywordItem
                key={`${book}-${chapter}-${verse}`}
                version={bibleDataVersion}
                verse={verse}
                btext={btext}
                codes={codes}
                isLight={true}
                isHighlighted={
                  selectedBible?.book === book &&
                  selectedBible?.chapter === chapter &&
                  selectedBible?.verse === verse
                }
              />
            ))
          : ''}
      </div>
    </div>
  )
}

const getHighlightColor = (index: number, isLight: boolean): TwStyle => {
  const lightColors = [tw`text-red-500`, tw`text-green-500`, tw`text-purple-500`]
  const darkColors = [tw`text-red-300`, tw`text-green-300`, tw`text-purple-300`]
  return isLight ? lightColors[index] : darkColors[index]
}

// 원본 텍스트 파싱
const parseRawText = (
  rawText: string,
  codes: string[],
  isLight: boolean
): (string | JSX.Element)[] => {
  const regex = /<W(H|G)(\d+[a-z]?)>/g
  const parts = rawText.split(regex) // WH001 -> ['Text ', 'H', '001', ' More Text']

  return parts.map((part, index) => {
    if (index % 3 === 1) {
      const type = part // 'H' 또는 'G'
      const number = parts[index + 1] // '001'
      const code = `${type}${number}` // 'H001'

      const matchedIndex = codes.indexOf(code)
      const codeStyle =
        matchedIndex >= 0
          ? [getHighlightColor(matchedIndex, isLight), tw`text-[1em] font-bold underline`]
          : isLight
            ? tw`text-brand-blue-500`
            : tw`text-white`

      return (
        <span key={index} css={[tw`text-[0.8em] px-[0.2em]`, codeStyle]}>
          {code}
        </span>
      )
    } else if (index % 3 === 2) {
      return ''
    }

    return part
  })
}

// 원본 텍스트 파싱 ('원전분해' 데이터 전용)
const parseRawTextForLexicon = (
  rawText: string,
  codes: string[],
  isLight: boolean
): (string | JSX.Element)[] => {
  return rawText.split('*').map((line) => {
    const regex = /^\[(.*?)\] \((.*?) <W(H\d+[a-z]?|G\d+[a-z]?)> \[(.*?)\] (.*?)\)@(.*?) # (.*?)$/
    const match = line.trim().match(regex)

    if (!match) {
      return ''
    }

    const [, mainText, type, code, rootText, pronunciation, grammar, meaning] = match

    const matchedIndex = codes.indexOf(code)
    const codeStyle =
      matchedIndex >= 0
        ? [getHighlightColor(matchedIndex, isLight), tw`text-[1em] font-bold underline`]
        : isLight
          ? tw`text-brand-blue-500`
          : tw`text-white`

    return (
      <>
        <span
          style={{ fontFamily: code?.[0] === 'H' ? 'Noto Serif Hebrew' : 'Noto Serif' }}
          className="text-[1.5em]"
        >
          {mainText}
        </span>
        ({type}
        <span css={[tw`text-[0.8em] px-[0.2em]`, codeStyle]}>{code}</span>
        <span
          style={{ fontFamily: code?.[0] === 'H' ? 'Noto Serif Hebrew' : 'Noto Serif' }}
          className="text-[1.5em]"
        >
          {rootText}
        </span>
        {pronunciation})
        <br />
        {' → '}
        <span>{grammar}</span>
        {' : '}
        <span className="font-bold">{meaning}</span>
        <br />
      </>
    )
  })
}

type KeywordMatchedVersesItemProps = {
  version: string
  book: number
  chapter: number
  verse: number
  btext: string
  codes: string[]
  isLight: boolean
  onLabelClick: (version: string, book: number, chapter: number, verse: number) => void
}

const KeywordMatchedVersesItem = ({
  version,
  book,
  chapter,
  verse,
  btext,
  codes,
  isLight,
  onLabelClick
}: KeywordMatchedVersesItemProps): JSX.Element => {
  return (
    <div data-verse={verse} css={[tw`mb-[0.25rem]`, verse === 1 ? tw`pt-[0.25rem]` : '']}>
      <div className="flex flex-col">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onLabelClick(version, book, chapter, verse)
          }}
          css={[tw`w-fit font-bold`, isLight ? tw`text-brand-blue-500` : tw`text-white`]}
        >
          {`${BOOK_INFO.find((el) => el.id === book)?.shortName || ''} ${chapter}:${verse}`}
        </a>
        <span className="ml-[1em]">
          {version === '원전분해'
            ? parseRawTextForLexicon(btext, codes, isLight)
            : parseRawText(btext, codes, isLight)}
        </span>
      </div>
    </div>
  )
}

type FullChaptersWithKeywordItemProps = {
  version: string
  verse: number
  btext: string
  codes: string[]
  isLight: boolean
  isHighlighted: boolean
}

const FullChaptersWithKeywordItem = ({
  version,
  verse,
  btext,
  codes,
  isLight,
  isHighlighted
}: FullChaptersWithKeywordItemProps): JSX.Element => {
  return (
    <div
      data-verse={verse}
      css={[
        tw`mb-[0.25rem]`,
        verse === 1 ? tw`pt-[0.25rem]` : '',
        isHighlighted ? tw`p-4pxr border-2 rounded-lg border-rose-500 bg-white` : ``
      ]}
    >
      <div className="flex">
        <span css={[tw`mr-[0.5em]`, isLight ? tw`text-brand-blue-500` : tw`text-white`]}>
          {verse}
        </span>
        <span>
          {version === '원전분해'
            ? parseRawTextForLexicon(btext, codes, isLight)
            : parseRawText(btext, codes, isLight)}
        </span>
      </div>
    </div>
  )
}
