import { bibleVerseSearchConditionAtom, bibleVerseSearchResultAtom } from '@renderer/store'
import { BOOK_INFO } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'
import Pagination from '../common/Pagination'
import { TBible } from '@shared/models'
import { formatNumberWithComma } from '@renderer/utils/numberFormat'

export default function BibleVerseViewer(): JSX.Element {
  const keywordMatchedVersesScrollRef = useRef<HTMLDivElement>(null)
  const fullChaptersWithKeywordScrollRef = useRef<HTMLDivElement>(null)

  const searchCondition = useAtomValue(bibleVerseSearchConditionAtom)
  const { version, bookRange, keywords } = searchCondition
  const [bibleVerseSearchResult, setBibleVerseSearchResult] = useAtom(bibleVerseSearchResultAtom)
  const { data: keywordMatchedVerses, totalCount, totalPages, currentPage } = bibleVerseSearchResult

  const [selectedBible, setSelectedBible] = useState<{
    version: string
    book: number
    chapter: number
    verse: number
  } | null>(null)
  const [bibleData, setBibleData] = useState<TBible[]>()

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
        keywords={keywords}
        isLight={true}
        onLabelClick={(version, book, chapter, verse) => {
          setSelectedBible({ version, book, chapter, verse })
        }}
      />
    ))
  }

  const handlePageChange = async (page: number): Promise<void> => {
    const result = await window.context.findKeywordFromBible({ ...searchCondition, page })
    if (result) {
      setBibleVerseSearchResult(result)
    }
  }

  useEffect(() => {
    if (keywordMatchedVersesScrollRef.current) {
      keywordMatchedVersesScrollRef.current.scrollTop = 0
    }
  }, [bibleVerseSearchResult])

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
        className="flex-1 p-16pxr overflow-y-auto bg-indigo-100"
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
              {keywords
                .filter((keyword) => keyword.trim() !== '')
                .map((keyword) => keyword.trim())
                .map((keyword, index) => (
                  <span key={keyword} css={[getHighlightColor(index, true), tw`font-bold`]}>
                    {keyword}
                  </span>
                ))}
            </div>
          </div>
        )}
        {renderVerseList()}
        <div className="sticky -bottom-16pxr flex justify-center -mx-16pxr -mb-16pxr py-8pxr bg-indigo-100">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div
        ref={fullChaptersWithKeywordScrollRef}
        className="flex-1 p-16pxr overflow-y-auto bg-rose-100"
      >
        {bibleData
          ? bibleData.map(({ book, chapter, verse, btext }) => (
              <FullChaptersWithKeywordItem
                key={`${book}-${chapter}-${verse}`}
                verse={verse}
                btext={btext}
                keywords={keywords}
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

const heighlightKeywords = (
  text: string,
  keywords: string[],
  isLight: boolean
): (string | JSX.Element)[] => {
  if (!keywords || keywords.length === 0) return [text]

  const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase())) {
      const matchedIndex = keywords.indexOf(part)
      const keywordStyle =
        matchedIndex >= 0
          ? [getHighlightColor(matchedIndex, isLight), tw`font-bold`]
          : isLight
            ? tw`text-black`
            : tw`text-white`

      return (
        <span key={i} css={[keywordStyle]}>
          {part}
        </span>
      )
    }

    return part
  })
}

type KeywordMatchedVersesItemProps = {
  version: string
  book: number
  chapter: number
  verse: number
  btext: string
  keywords: string[]
  isLight: boolean
  onLabelClick: (version: string, book: number, chapter: number, verse: number) => void
}

const KeywordMatchedVersesItem = ({
  version,
  book,
  chapter,
  verse,
  btext,
  keywords,
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
        <span className="ml-[1em]">{heighlightKeywords(btext, keywords, isLight)}</span>
      </div>
    </div>
  )
}

type FullChaptersWithKeywordItemProps = {
  verse: number
  btext: string
  keywords: string[]
  isLight: boolean
  isHighlighted: boolean
}

const FullChaptersWithKeywordItem = ({
  verse,
  btext,
  keywords,
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
        <span>{heighlightKeywords(btext, keywords, isLight)}</span>
      </div>
    </div>
  )
}
