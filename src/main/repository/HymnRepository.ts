import { TFindHymn, TFindKeywordFromHymn } from '@shared/types.js'
import { getHymnDB } from './getDB.js'
import { THymn } from '@shared/models.js'

export const findHymn: TFindHymn = async (hymnNumber: string) => {
  try {
    const db = getHymnDB('찬송가')

    const query = `SELECT * FROM Hymn WHERE hymn_number = ${hymnNumber}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as THymn[]

    return Promise.resolve(rowList)
  } catch (err) {
    console.error(err)
    return Promise.resolve([])
  }
}

export const findKeywordFromHymn: TFindKeywordFromHymn = async ({
  searchTarget,
  keywords,
  matchType,
  page = 1,
  pageSize = 500
}) => {
  try {
    const db = getHymnDB('찬송가')

    if (!keywords || keywords.length === 0) {
      throw new Error('Invalid keywords')
    }

    let targetColumn = ''
    switch (searchTarget) {
      case 'title':
        targetColumn = 'title'
        break
      case 'lyrics':
        targetColumn = 'lyrics'
        break
      default:
        throw new Error('Invalid searchTarget')
    }

    const conditions = keywords
      .filter((keyword) => keyword.trim() !== '')
      .map((keyword) => `${targetColumn} LIKE '%${keyword}%'`)

    const whereSQL = matchType === 'any' ? conditions.join(' OR ') : conditions.join(' AND ')

    // 전체 개수 조회
    const countRow = db.prepare(`SELECT COUNT(*) as count FROM Hymn WHERE ${whereSQL}`).get() as {
      count: number | string
    }
    const totalCount = Number(countRow.count)
    const totalPages = Math.ceil(totalCount / pageSize)

    // 데이터 조회
    const offset = (page - 1) * pageSize
    const data = db
      .prepare(`SELECT * FROM Hymn WHERE ${whereSQL} LIMIT ${pageSize} OFFSET ${offset}`)
      .all() as THymn[]

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages
    }
  } catch (err) {
    console.log(err)
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0
    }
  }
}
