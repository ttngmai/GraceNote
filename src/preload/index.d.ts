/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TFindBible,
  TFindLexicalCodeFromBible,
  TFindHymn,
  TFindLexicon,
  TFindCommentary,
  TFindKeywordFromBible
} from '@shared/types'

declare global {
  interface Window {
    electron: {
      locale: string
      store: {
        get: (key: string) => any
        set: (key: string, value: any) => void
      }
      menu: {
        showContextMenu: (elementType: string, imageUrl?: string) => void
      }
    }
    context: {
      findBible: TFindBible
      findCommentary: TFindCommentary
      findLexicon: TFindLexicon
      findKeywordFromBible: TFindKeywordFromBible
      findLexicalCodeFromBible: TFindLexicalCodeFromBible
      findHymn: TFindHymn
      getAudioFilePath: (fileName: string) => string
      getImageFilePath: (fileName: string) => string
      openBibleVerseWindow: () => void
      openLexiconWindow: () => void
      openHymnWindow: () => void
    }
  }
}
