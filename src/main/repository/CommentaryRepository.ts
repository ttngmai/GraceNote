import { TFindCommentary } from '@shared/types.js'
import { getCommentaryDB } from './getDB.js'
import { TCommentary } from '@shared/models.js'

export const findCommentary: TFindCommentary = async (version, book, chapter) => {
  try {
    const db = getCommentaryDB(version)

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TCommentary[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}
