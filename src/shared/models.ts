export type TBible = {
  id: number
  book: number
  chapter: number
  verse: number
  btext: string
}

export type TCommentary = {
  id: number
  book: number
  chapter: number
  verse: number
  btext: string
}

export type TLexicon = {
  id: number
  code: string
  word: string
  definition: string
}

export type THymn = {
  id: number
  hymn_number: string
  title: string
  lyrics: string
}
