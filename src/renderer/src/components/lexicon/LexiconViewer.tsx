import { lexicalCodeSearchParamsAtom, lexicalCodeSearchResultAtom } from '@renderer/store'
import { BOOK_INFO } from '@shared/constants'
import { useAtomValue } from 'jotai'
import tw, { TwStyle } from 'twin.macro'
import { forwardRef, Key, useEffect, useRef, useState } from 'react'
import { TBible } from '@shared/models'
import { formatNumberWithComma } from '@renderer/utils/numberFormat'
import Spinner from '../common/Spinner'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLexicons } from '@renderer/api/lexicon'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'

export default function LexiconViewer(): JSX.Element {
  const keywordMatchedVersesScrollRef = useRef<VirtuosoHandle>(null)
  const fullChaptersWithKeywordScrollRef = useRef<HTMLDivElement>(null)

  const searchParams = useAtomValue(lexicalCodeSearchParamsAtom)
  const { version, bookRange, codes } = searchParams
  const lexicalCodeSearchResult = useAtomValue(lexicalCodeSearchResultAtom)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lexicons', searchParams],
    queryFn: ({ pageParam = 1 }) => fetchLexicons({ pageParam, ...searchParams }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined
  })
  const verses: TBible[] = data?.pages.flatMap((p) => p.data) ?? []

  const [selectedBible, setSelectedBible] = useState<{
    version: string
    book: number
    chapter: number
    verse: number
  } | null>(null)
  const [bibleData, setBibleData] = useState<TBible[]>()
  const [bibleDataVersion, setBibleDataVersion] = useState<string>('')

  useEffect(() => {
    if (keywordMatchedVersesScrollRef.current) {
      keywordMatchedVersesScrollRef.current.scrollToIndex({ index: 0 })
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
      <div className="flex-1 overflow-hidden bg-[#ABC3E2]">
        {searchParams && (
          <div className="flex flex-col p-16pxr">
            <div>
              ◆ {BOOK_INFO.find((el) => el.id === bookRange[0])?.shortName || ''}
              {' ~ '}
              {BOOK_INFO.find((el) => el.id === bookRange[1])?.shortName || ''} {`(${version})`}
              {' : '}
              {formatNumberWithComma(lexicalCodeSearchResult.totalCount)} 구절
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
        <div className="w-full h-[calc(100%-80px)]">
          <VerseList
            ref={keywordMatchedVersesScrollRef}
            verses={verses}
            version={version}
            codes={codes}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLabelClick={(version, book, chapter, verse) => {
              setSelectedBible({ version, book, chapter, verse })
            }}
          />
        </div>
      </div>
      <div
        ref={fullChaptersWithKeywordScrollRef}
        className="flex-1 p-16pxr overflow-y-auto bg-[#CEBEF6]"
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
  const lightColors = [tw`text-red-500`, tw`text-orange-500`, tw`text-purple-500`]
  const darkColors = [tw`text-red-300`, tw`text-orange-300`, tw`text-purple-300`]
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

const VerseListContent = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} className="p-16pxr" />
})
VerseListContent.displayName = 'VerseListContent'

const VerseListFooter = (): JSX.Element => <div className="h-16pxr" />

type VerseListProps = {
  verses: TBible[]
  version: string
  codes: string[]
  fetchNextPage
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLabelClick: KeywordMatchedVersesItemProps['onLabelClick']
}

const VerseList = forwardRef<VirtuosoHandle, VerseListProps>(
  (
    { verses, version, codes, fetchNextPage, hasNextPage, isFetchingNextPage, onLabelClick },
    ref
  ) => {
    return (
      <Virtuoso
        ref={ref}
        data={verses}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        itemContent={(_, { book, chapter, verse, btext }) => {
          return (
            <>
              <KeywordMatchedVersesItem
                version={version}
                book={book}
                chapter={chapter}
                verse={verse}
                btext={btext}
                codes={codes}
                isLight={true}
                onLabelClick={onLabelClick}
              />
              {isFetchingNextPage && (
                <div className="flex justify-center items-center gap-4pxr w-full pt-16pxr">
                  <p>로딩 중</p>
                  <Spinner />
                </div>
              )}
            </>
          )
        }}
        components={{
          List: VerseListContent,
          Footer: VerseListFooter
        }}
        className="overflow-y-scroll"
      />
    )
  }
)
VerseList.displayName = 'VerseList'

type KeywordMatchedVersesItemProps = {
  key?: Key | null | undefined
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
  key?: Key | null | undefined
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
        isHighlighted ? tw`p-4pxr border-2 rounded-lg bg-stone-200 shadow` : ``
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
