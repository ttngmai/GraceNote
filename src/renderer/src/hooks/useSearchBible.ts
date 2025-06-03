import { bookAtom, chapterAtom, verseAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'

export default function useSearchBible(): (book: number, chapter: number, verse: number) => void {
  const setBook = useSetAtom(bookAtom)
  const setChapter = useSetAtom(chapterAtom)
  const setVerse = useSetAtom(verseAtom)

  const searchBible = (book: number, chapter: number, verse: number): void => {
    setBook(book)
    setChapter(chapter)
    setVerse(verse)
  }

  return searchBible
}
