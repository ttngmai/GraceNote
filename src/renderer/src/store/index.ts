import { createPersistentAtom } from '@renderer/utils/createPersistentAtom'
import { createInitialPanelGrid } from '@renderer/utils/panelUtils'
import { PANEL_CATEGORIES_AND_VERSIONS, PANEL_COLUMNS } from '@shared/constants'
import { TBible, THymn } from '@shared/models'
import {
  FindKeywordFromBibleParams,
  ColumnSelectorState,
  ScoreViewMode,
  FindLexicalCodeFromBibleParams,
  PanelCategory,
  TPagedResult,
  TPanelGrid,
  FindKeywordFromHymnParams,
  HymnPageViewMode
} from '@shared/types'
import { atom } from 'jotai'

export const panelGridAtom = createPersistentAtom<TPanelGrid>('panelGrid', createInitialPanelGrid())
export const columnSelectorAtom = atom<ColumnSelectorState>({
  visible: false,
  selectedIndices: []
})
export const columnSizesAtom = createPersistentAtom<number[]>(
  'columnSizes',
  Array.from({ length: PANEL_COLUMNS }, () => 1)
)
export const columnSizesResetKeyAtom = atom<string>('columnSizesResetKey')
export const panelTitleSizeAtom = createPersistentAtom<number>('panelTitleSize', 14)
export const panelTextSizeAtom = createPersistentAtom<number>('panelTextSize', 16)
export const hasAutoScrolledBasePanelAtom = atom<boolean>(false)

export const bookAtom = createPersistentAtom<number>('book', 1)
export const chapterAtom = createPersistentAtom<number>('chapter', 1)
export const verseAtom = createPersistentAtom<number>('verse', 1)
export const bibleVerseSearchParamsAtom = createPersistentAtom<FindKeywordFromBibleParams>(
  'bibleVerseSearchParams',
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
export const lexicalCodeSearchParamsAtom = createPersistentAtom<FindLexicalCodeFromBibleParams>(
  'lexicalCodeSearchParams',
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
export const hymnPageViewModeAtom = createPersistentAtom<HymnPageViewMode>(
  'hymnPageViewMode',
  'list'
)
export const scoreViewModeAtom = createPersistentAtom<ScoreViewMode>('scoreViewMode', 'imageMode')
export const hymnTextSizeAtom = createPersistentAtom<number>('hymnTextSize', 16)
export const hymnSearchParamsAtom = createPersistentAtom<FindKeywordFromHymnParams>(
  'hymnSearchParams',
  {
    searchTarget: 'lyrics',
    keywords: [],
    matchType: 'all'
  }
)
export const hymnSearchResultAtom = atom<TPagedResult<THymn>>({
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
})
