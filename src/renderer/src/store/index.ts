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

const panelGridAtom = atom<TPanelGrid, [TPanelGrid], void>(
  window.electron.store.get('panelGrid') || createInitialPanelGrid(),
  (_, set, newLayout) => set(panelGridAtom, newLayout)
)
const hiddenRowsAtom = atom<number[], [number[]], void>(
  window.electron.store.get('hiddenRows') || [],
  (_, set, newValue) => set(hiddenRowsAtom, newValue)
)
const hiddenColsAtom = atom<number[], [number[]], void>(
  window.electron.store.get('hiddenCols') || [],
  (_, set, newValue) => set(hiddenColsAtom, newValue)
)
const panelTextSizeAtom = atom<number>(Number(window.electron.store.get('panelTextSize') || 16))

const bookAtom = atom<number>(Number(window.electron.store.get('book') || 1))
const chapterAtom = atom<number>(Number(window.electron.store.get('chapter') || 1))
const verseAtom = atom<number>(Number(window.electron.store.get('verse') || 1))

const bibleVerseSearchAtom = atom<BibleVerseSearchCondition, [BibleVerseSearchCondition], void>(
  window.electron.store.get('bibleVerseSearchCondition') || {
    version: PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.BIBLE][0],
    bookRange: [1, 66],
    keywords: [],
    matchType: 'all'
  },
  (_, set, newValue) => set(bibleVerseSearchAtom, newValue)
)
const bibleVerseSearchResultAtom = atom<TPagedResult<TBible>>({
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
})

const lexicalCodeAtom = atom<string>(String(window.electron.store.get('lexicalCode') || ''))
const lexicalCodeSearchAtom = atom<LexicalCodeSearchCondition, [LexicalCodeSearchCondition], void>(
  window.electron.store.get('lexicalCodeSearchCondition') || {
    version: PANEL_CATEGORIES_AND_VERSIONS[PanelCategory.CODED_BIBLE][0],
    bookRange: [1, 66],
    codes: [],
    matchType: 'all'
  },
  (_, set, newValue) => set(lexicalCodeSearchAtom, newValue)
)
const lexicalCodeSearchResultAtom = atom<TPagedResult<TBible>>({
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
})

const hymnAtom = atom<THymn | null, [THymn], void>(
  window.electron.store.get('hymn') || null,
  (_, set, newValue) => set(hymnAtom, newValue)
)
const hymnDisplayModeAtom = atom<HymnDisplayMode, [HymnDisplayMode], void>(
  window.electron.store.get('hymnDisplayMode') || 'scoreMode',
  (_, set, newMode) => set(hymnDisplayModeAtom, newMode)
)
const hymnTextSizeAtom = atom<number>(Number(window.electron.store.get('hymnTextSize') || 16))

export const readWritePanelGridAtom = atom<TPanelGrid, [TPanelGrid], void>(
  (get) => get(panelGridAtom),
  (_, set, newValue) => {
    set(panelGridAtom, newValue)
    window.electron.store.set('panelGrid', newValue)
  }
)
export const readWriteHiddenRowsAtom = atom<number[], [number[]], void>(
  (get) => get(hiddenRowsAtom),
  (_, set, newValue) => {
    set(hiddenRowsAtom, newValue)
    window.electron.store.set('hiddenRows', newValue)
  }
)
export const readWriteHiddenColsAtom = atom<number[], [number[]], void>(
  (get) => get(hiddenColsAtom),
  (_, set, newValue) => {
    set(hiddenColsAtom, newValue)
    window.electron.store.set('hiddenCols', newValue)
  }
)
export const readWritePanelTextSizeAtom = atom<number, [number], void>(
  (get) => get(panelTextSizeAtom),
  (_, set, newValue) => {
    set(panelTextSizeAtom, newValue)
    window.electron.store.set('panelTextSize', newValue)
  }
)

export const readWriteBookAtom = atom<number, [number], void>(
  (get) => get(bookAtom),
  (_, set, newValue) => {
    set(bookAtom, newValue)
    window.electron.store.set('book', newValue)
  }
)
export const readWriteChapterAtom = atom<number, [number], void>(
  (get) => get(chapterAtom),
  (_, set, newValue) => {
    set(chapterAtom, newValue)
    window.electron.store.set('chapter', newValue)
  }
)
export const readWriteVerseAtom = atom<number, [number], void>(
  (get) => get(verseAtom),
  (_, set, newValue) => {
    set(verseAtom, newValue)
    window.electron.store.set('verse', newValue)
  }
)
export const readWriteBibleVerseSearchResultAtom = atom<
  TPagedResult<TBible>,
  [TPagedResult<TBible>],
  void
>(
  (get) => get(bibleVerseSearchResultAtom),
  (_, set, newValue) => {
    set(bibleVerseSearchResultAtom, newValue)
  }
)

export const readWriteBibleVerseSearchAtom = atom<
  BibleVerseSearchCondition,
  [BibleVerseSearchCondition],
  void
>(
  (get) => get(bibleVerseSearchAtom),
  (_, set, newValue) => {
    set(bibleVerseSearchAtom, newValue)
    window.electron.store.set('bibleVerseSearchCondition', newValue)
  }
)

export const readWriteLexicalCodeAtom = atom<string, [string], void>(
  (get) => get(lexicalCodeAtom),
  (_, set, newValue) => {
    set(lexicalCodeAtom, newValue)
    window.electron.store.set('lexicalCode', newValue)
  }
)
export const readWriteLexicalCodeSearchAtom = atom<
  LexicalCodeSearchCondition,
  [LexicalCodeSearchCondition],
  void
>(
  (get) => get(lexicalCodeSearchAtom),
  (_, set, newValue) => {
    set(lexicalCodeSearchAtom, newValue)
    window.electron.store.set('lexicalCodeSearchCondition', newValue)
  }
)
export const readWriteLexicalCodeSearchResultAtom = atom<
  TPagedResult<TBible>,
  [TPagedResult<TBible>],
  void
>(
  (get) => get(lexicalCodeSearchResultAtom),
  (_, set, newValue) => {
    set(lexicalCodeSearchResultAtom, newValue)
  }
)

export const readWriteHymnAtom = atom<THymn | null, [THymn], void>(
  (get) => get(hymnAtom),
  (_, set, newValue) => {
    set(hymnAtom, newValue)
    window.electron.store.set('hymn', newValue)
  }
)
export const readWriteHymnDisplayModeAtom = atom<HymnDisplayMode, [HymnDisplayMode], void>(
  (get) => get(hymnDisplayModeAtom),
  (_, set, newValue) => {
    set(hymnDisplayModeAtom, newValue)
    window.electron.store.set('hymnDisplayMode', newValue)
  }
)
export const readWriteHymnTextSizeAtom = atom<number, [number], void>(
  (get) => get(hymnTextSizeAtom),
  (_, set, newValue) => {
    set(hymnTextSizeAtom, newValue)
    window.electron.store.set('hymnTextSize', newValue)
  }
)
