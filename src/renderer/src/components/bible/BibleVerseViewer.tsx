import { bibleVerseSearchParamsAtom, bibleVerseSearchResultAtom } from '@renderer/store'
import { BOOK_INFO } from '@shared/constants'
import { useAtomValue } from 'jotai'
import { forwardRef, Key, useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'
import { TBible } from '@shared/models'
import { formatNumberWithComma } from '@renderer/utils/numberFormat'
import Spinner from '../common/Spinner'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchBibleVerses } from '@renderer/api/bible'

export default function BibleVerseViewer(): JSX.Element {
  const keywordMatchedVersesScrollRef = useRef<VirtuosoHandle>(null)
  const fullChaptersWithKeywordScrollRef = useRef<HTMLDivElement>(null)

  const searchParams = useAtomValue(bibleVerseSearchParamsAtom)
  const { version, bookRange, keywords } = searchParams
  const bibleVerseSearchResult = useAtomValue(bibleVerseSearchResultAtom)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['bibleVerses', searchParams],
    queryFn: ({ pageParam = 1 }) => fetchBibleVerses({ pageParam, ...searchParams }),
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

  useEffect(() => {
    if (keywordMatchedVersesScrollRef.current) {
      keywordMatchedVersesScrollRef.current.scrollToIndex({ index: 0 })
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
      <div className="flex-1 overflow-hidden bg-[#9FC9B7]">
        {searchParams && (
          <div className="flex flex-col p-16pxr">
            <div>
              ◆ {BOOK_INFO.find((el) => el.id === bookRange[0])?.shortName || ''}
              {' ~ '}
              {BOOK_INFO.find((el) => el.id === bookRange[1])?.shortName || ''} {`(${version})`}
              {' : '}
              {formatNumberWithComma(bibleVerseSearchResult.totalCount)} 구절
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
        <div className="w-full h-[calc(100%-80px)]">
          <VerseList
            ref={keywordMatchedVersesScrollRef}
            verses={verses}
            version={version}
            keywords={keywords}
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
        className="flex-1 p-16pxr overflow-y-auto bg-[#C6BF8F]"
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
  const lightColors = [tw`text-red-500`, tw`text-orange-500`, tw`text-purple-500`]
  const darkColors = [tw`text-red-300`, tw`text-orange-300`, tw`text-purple-300`]
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

const VerseListContent = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} className="p-16pxr" />
})
VerseListContent.displayName = 'VerseListContent'

const VerseListFooter = (): JSX.Element => <div className="h-16pxr" />

type VerseListProps = {
  verses: TBible[]
  version: string
  keywords: string[]
  fetchNextPage
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLabelClick: KeywordMatchedVersesItemProps['onLabelClick']
}

const VerseList = forwardRef<VirtuosoHandle, VerseListProps>(
  (
    { verses, version, keywords, fetchNextPage, hasNextPage, isFetchingNextPage, onLabelClick },
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
                keywords={keywords}
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
  keywords: string[]
  isLight: boolean
  onLabelClick: (version: string, book: number, chapter: number, verse: number) => void
}

const KeywordMatchedVersesItem = forwardRef<HTMLDivElement, KeywordMatchedVersesItemProps>(
  ({ version, book, chapter, verse, btext, keywords, isLight, onLabelClick }, ref) => {
    return (
      <div
        ref={ref}
        data-verse={verse}
        css={[tw`mb-[0.25rem]`, verse === 1 ? tw`pt-[0.25rem]` : '']}
      >
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
)
KeywordMatchedVersesItem.displayName = 'KeywordMatchedVersesItem'

type FullChaptersWithKeywordItemProps = {
  key?: Key | null | undefined
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
        isHighlighted ? tw`p-4pxr border-2 rounded-lg bg-stone-200 shadow` : ``
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
