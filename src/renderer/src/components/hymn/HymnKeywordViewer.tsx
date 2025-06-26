import {
  hymnAtom,
  hymnPageViewModeAtom,
  hymnSearchParamsAtom,
  hymnSearchResultAtom,
  hymnTextSizeAtom
} from '@renderer/store'
import { THymn } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { forwardRef, useRef } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Spinner from '../common/Spinner'
import { formatNumberWithComma } from '@renderer/utils/numberFormat'
import tw, { TwStyle } from 'twin.macro'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchHymns } from '@renderer/api/hymn'

export default function HymnKeywordViewer(): JSX.Element {
  const keywordMatchedHymnScrollRef = useRef<VirtuosoHandle>(null)

  const searchParams = useAtomValue(hymnSearchParamsAtom)
  const { keywords } = searchParams
  const hymnSearchResult = useAtomValue(hymnSearchResultAtom)
  const setHymn = useSetAtom(hymnAtom)
  const setHymnPageViewModeAtom = useSetAtom(hymnPageViewModeAtom)
  const hymnTextSize = useAtomValue(hymnTextSizeAtom)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['hymns', searchParams],
    queryFn: ({ pageParam = 1 }) => fetchHymns({ pageParam, ...searchParams }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined
  })
  const hymns: THymn[] = data?.pages.flatMap((p) => p.data) ?? []

  const handleSearchHymnByHymnNumber = async (hymnNumber: string): Promise<void> => {
    const result = await window.context.findHymn(hymnNumber.trim())
    if (result && result.length > 0) {
      setHymn(result[0])
      setHymnPageViewModeAtom('score')
    }
  }

  return (
    <div className="flex w-full">
      <div className="flex-1 overflow-hidden">
        {searchParams && (
          <div className="flex flex-col p-16pxr">
            <div>
              ◆ 새찬송가
              {' : '}
              {formatNumberWithComma(hymnSearchResult.totalCount)} 장
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
          <HymnList
            ref={keywordMatchedHymnScrollRef}
            hymns={hymns}
            keywords={keywords}
            hymnTextSize={hymnTextSize}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLabelClick={handleSearchHymnByHymnNumber}
          />
        </div>
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

const HymnListContent = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} className="p-16pxr" />
})
HymnListContent.displayName = 'HymnListContent'

const HymnListFooter = (): JSX.Element => <div className="h-16pxr" />

type HymnListProps = {
  hymns: THymn[]
  keywords: string[]
  hymnTextSize: number
  fetchNextPage
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLabelClick: (hymnNumber: string) => void
}

const HymnList = forwardRef<VirtuosoHandle, HymnListProps>(
  (
    { hymns, keywords, hymnTextSize, fetchNextPage, hasNextPage, isFetchingNextPage, onLabelClick },
    ref
  ) => {
    return (
      <Virtuoso
        ref={ref}
        data={hymns}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        itemContent={(_, { hymn_number, title, lyrics }) => {
          return (
            <>
              <div className={`w-fit p-16pxr text-[${hymnTextSize}px]`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onLabelClick(hymn_number)
                  }}
                  className="block w-fit font-bold text-brand-blue-500"
                >
                  {`${hymn_number}. ${title}`}
                </a>
                <br />
                <LyricsRenderer lyrics={lyrics} keywords={keywords} />
              </div>
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
          List: HymnListContent,
          Footer: HymnListFooter
        }}
        className="overflow-y-scroll"
      />
    )
  }
)
HymnList.displayName = 'HymnList'

type LyricsRendererProps = {
  lyrics: string
  keywords: string[]
}

export const LyricsRenderer: React.FC<LyricsRendererProps> = ({
  lyrics,
  keywords
}: LyricsRendererProps) => {
  if (!lyrics) return null

  const lines = lyrics.split('\n')

  return (
    <div>
      {lines.map((line, index) => {
        const trimmedLine = line.trim()

        if (trimmedLine === '') {
          return <br key={index} />
        }

        const isSectionHeader = /^(후렴|\d+절)/.test(trimmedLine)

        return (
          <p key={index}>
            {isSectionHeader ? (
              <b>{trimmedLine}</b>
            ) : (
              heighlightKeywords(trimmedLine, keywords, true)
            )}
          </p>
        )
      })}
    </div>
  )
}
