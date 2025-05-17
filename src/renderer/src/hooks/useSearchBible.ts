import { readWriteBookAtom, readWriteChapterAtom, readWriteVerseAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'

export default function useSearchBible(): (book: number, chapter: number, verse: number) => void {
  const setBook = useSetAtom(readWriteBookAtom)
  const setChapter = useSetAtom(readWriteChapterAtom)
  const setVerse = useSetAtom(readWriteVerseAtom)

  const searchBible = (book: number, chapter: number, verse: number): void => {
    setBook(book)
    setChapter(chapter)
    setVerse(verse)
  }

  return searchBible
}
