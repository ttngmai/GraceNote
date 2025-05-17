import { TFindHymn, TFindHymnParams } from '@shared/types.js'
import { getHymnDB } from './getDB.js'
import { THymn } from '@shared/models.js'

export const findHymn: TFindHymn = async (params: TFindHymnParams) => {
  try {
    const db = getHymnDB('찬송가')

    const whereClauses: string[] = []
    const values: any[] = []

    if (params.hymn_number) {
      whereClauses.push('hymn_number = ?')
      values.push(params.hymn_number)
    }
    if (params.title) {
      whereClauses.push('title LIKE ?')
      values.push(`%${params.title}%`)
    }
    if (params.lyrics) {
      whereClauses.push('lyrics LIKE ?')
      values.push(`%${params.lyrics}%`)
    }

    const whereQuery = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const query = `SELECT id, hymn_number, title, lyrics FROM Hymn ${whereQuery}`
    const readQuery = db.prepare(query)

    const rowList = readQuery.all(values) as THymn[]

    return Promise.resolve(rowList)
  } catch (err) {
    console.error(err)
    return Promise.resolve([])
  }
}
