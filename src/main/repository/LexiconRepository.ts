import { TFindLexicon } from '@shared/types.js'
import { getLexiconDB } from './getDB.js'
import { TLexicon } from '@shared/models.js'

export const findLexicon: TFindLexicon = async (version, code) => {
  try {
    const db = getLexiconDB(version)

    const query = `SELECT * FROM Lexicon WHERE code = '${code}'`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TLexicon[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}
