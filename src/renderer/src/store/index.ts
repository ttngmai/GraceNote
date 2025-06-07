import { createPersistentAtom } from '@renderer/utils/createPersistentAtom'
import { createInitialPanelGrid } from '@renderer/utils/panelUtils'
import { PANEL_CATEGORIES_AND_VERSIONS } from '@shared/constants'
import { TBible, THymn } from '@shared/models'
import {
  BibleVerseSearchCondition,
  HymnDisplayMode,
  LexicalCodeSearchCondition,
  PanelCategory,
  TPagedResult,
  TPanelGrid
} from '@shared/types'
import { atom } from 'jotai'

export const panelGridAtom = createPersistentAtom<TPanelGrid>('panelGrid', createInitialPanelGrid())
export const columnSizesAtom = createPersistentAtom<number[]>('columnSizes', [])
export const columnSizesResetKeyAtom = atom<string>('columnSizesResetKey')
export const panelTextSizeAtom = createPersistentAtom<number>('panelTextSize', 16)

export const bookAtom = createPersistentAtom<number>('book', 1)
export const chapterAtom = createPersistentAtom<number>('chapter', 1)
export const verseAtom = createPersistentAtom<number>('verse', 1)
export const bibleVerseSearchConditionAtom = createPersistentAtom<BibleVerseSearchCondition>(
  'bibleVerseSearchCondition',
  {
    version: PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.BIBLE][0],
    bookRange: [1, 66],
    keywords: [],
    matchType: 'all'
  }
)
export const bibleVerseSearchResultAtom = atom<TPagedResult<TBible>>({
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
})

export const lexicalCodeAtom = createPersistentAtom<string>('lexicalCode', '')
export const lexicalCodeSearchConditionAtom = createPersistentAtom<LexicalCodeSearchCondition>(
  'lexicalCodeSearchCondition',
  {
    version: PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.CODED_BIBLE][0],
    bookRange: [1, 66],
    codes: [],
    matchType: 'all'
  }
)
export const lexicalCodeSearchResultAtom = atom<TPagedResult<TBible>>({
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
})

export const hymnAtom = createPersistentAtom<THymn | null>('hymn', null)
export const hymnDisplayModeAtom = createPersistentAtom<HymnDisplayMode>(
  'hymnDisplayMode',
  'scoreMode'
)
export const hymnTextSizeAtom = createPersistentAtom<number>('hymnTextSize', 16)
