import { TBible, TCommentary, THymn, TLexicon } from './models.js'

export type TPagedResult<T> = {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export enum PanelCategory {
  BIBLE = '성경',
  COMMENTARY = '주석',
  CODED_BIBLE = '코드역본',
  LEXICON = '원어사전',
  NONE = '없음'
}

export type PanelState = 'normal' | 'master' | 'hidden'

export type TPanelLayout = {
  id: string
  row: number
  col: number
  state: PanelState
  originalState?: PanelState // 숨기기 전에 상태를 기억
  mergeRange?: { startRow: number; startCol: number; endRow: number; endCol: number }
}

export type TPanelSettings = {
  id: string
  isBase: boolean
  category: PanelCategory
  version: string
  backgroundColor: string
  textColor: string
}

export type TPanelGrid = {
  panels: TPanelLayout[]
  settings: Record<string, TPanelSettings>
}

export type TFindBible = (version: string, book: number, chapter: number) => Promise<TBible[]>

export type TFindCommentary = (
  version: string,
  book: number,
  chapter: number
) => Promise<TCommentary[]>

export type BibleVerseSearchCondition = {
  version: string
  bookRange: [number, number]
  keywords: string[]
  matchType: 'all' | 'any'
}

export type TFindKeywordFromBible = (
  condition: BibleVerseSearchCondition & {
    page?: number
    pageSize?: number
  }
) => Promise<TPagedResult<TBible>>

export type LexicalCodeSearchCondition = {
  version: string
  bookRange: [number, number]
  codes: string[]
  matchType: 'all' | 'any'
}

export type TFindLexicalCodeFromBible = (
  condition: LexicalCodeSearchCondition & {
    page?: number
    pageSize?: number
  }
) => Promise<TPagedResult<TBible>>

export type TFindLexicon = (version: string, code: string) => Promise<TLexicon[]>

export type TFindHymnParams = {
  hymn_number?: string
  title?: string
  lyrics?: string
}

export type TFindHymn = (params: TFindHymnParams) => Promise<THymn[]>

export type HymnDisplayMode = 'scoreMode' | 'lyricsMode'
