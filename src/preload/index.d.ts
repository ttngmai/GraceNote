/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TFindBible,
  TFindLexicalCodeFromBible,
  TFindHymn,
  TFindLexicon,
  TFindCommentary,
  TFindKeywordFromBible,
  TFindKeywordFromHymn
} from '@shared/types'

declare global {
  interface Window {
    electron: {
      locale: string
      store: {
        get: (key: string) => any
        set: (key: string, value: any) => void
        delete: (key: string) => void
      }
      menu: {
        showContextMenu: (elementType: string, imageUrl?: string) => void
      }
    }
    context: {
      findBible: TFindBible
      findCommentary: TFindCommentary
      findLexicon: TFindLexicon
      findHymn: TFindHymn
      findKeywordFromBible: TFindKeywordFromBible
      findLexicalCodeFromBible: TFindLexicalCodeFromBible
      findKeywordFromHymn: TFindKeywordFromHymn
      getAudioFilePath: (fileName: string) => string
      getImageFilePath: (fileName: string) => string
      openBibleVerseWindow: () => void
      openLexiconWindow: (keyword?: string) => void
      onUpdateLexicalCode: (callback) => void
      openHymnWindow: () => void
    }
  }
}
