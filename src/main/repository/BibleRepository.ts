import { TFindBible, TFindKeywordFromBible, TFindLexicalCodeFromBible } from '@shared/types.js'
import { getBibleDB } from './getDB.js'
import { TBible } from '@shared/models.js'

export const findBible: TFindBible = async (version, book, chapter) => {
  try {
    const db = getBibleDB(version)

    const query = `SELECT * FROM Bible WHERE book = ${book} AND chapter = ${chapter}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all() as TBible[]

    return Promise.resolve(rowList)
  } catch (err) {
    return Promise.resolve([])
  }
}

export const findKeywordFromBible: TFindKeywordFromBible = async ({
  version,
  bookRange,
  keywords,
  matchType,
  page = 1,
  pageSize = 100
}) => {
  try {
    const db = getBibleDB(version)

    if (!keywords || keywords.length === 0) {
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0
      }
    }

    const conditions = keywords
      .filter((keyword) => keyword.trim() !== '')
      .map((keyword) => `btext LIKE '%${keyword}%'`)
    const codeCondition = matchType === 'any' ? conditions.join(' OR ') : conditions.join(' AND ')

    let rangeCondition = ''
    if (bookRange && bookRange.length === 2) {
      const [start, end] = bookRange
      if (start && end) {
        rangeCondition = `book BETWEEN ${start} AND ${end}`
      }
    }

    const whereClauses = [codeCondition]
    if (rangeCondition) {
      whereClauses.push(rangeCondition)
    }

    const whereSQL = whereClauses.join(' AND ')

    // 전체 개수 조회
    const countRow = db.prepare(`SELECT COUNT(*) as count FROM Bible WHERE ${whereSQL}`).get() as {
      count: number | string
    }
    const totalCount = Number(countRow.count)
    const totalPages = Math.ceil(totalCount / pageSize)

    // 데이터 조회
    const offset = (page - 1) * pageSize
    const data = db
      .prepare(`SELECT * FROM Bible WHERE ${whereSQL} LIMIT ${pageSize} OFFSET ${offset}`)
      .all() as TBible[]

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

export const findLexicalCodeFromBible: TFindLexicalCodeFromBible = async ({
  version,
  bookRange,
  codes,
  matchType,
  page = 1,
  pageSize = 100
}) => {
  try {
    const db = getBibleDB(version)

    if (!codes || codes.length === 0) {
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0
      }
    }

    const conditions = codes
      .filter((code) => code.trim() !== '')
      .map((code) => code.trim().toUpperCase())
      .map((code) => `btext LIKE '%<W${code}>%'`)
    const codeCondition = matchType === 'any' ? conditions.join(' OR ') : conditions.join(' AND ')

    let rangeCondition = ''
    if (bookRange && bookRange.length === 2) {
      const [start, end] = bookRange
      if (start && end) {
        rangeCondition = `book BETWEEN ${start} AND ${end}`
      }
    }

    const whereClauses = [codeCondition]
    if (rangeCondition) {
      whereClauses.push(rangeCondition)
    }

    const whereSQL = whereClauses.join(' AND ')

    // 전체 개수 조회
    const countRow = db.prepare(`SELECT COUNT(*) as count FROM Bible WHERE ${whereSQL}`).get() as {
      count: number | string
    }
    const totalCount = Number(countRow.count)
    const totalPages = Math.ceil(totalCount / pageSize)

    // 데이터 조회
    const offset = (page - 1) * pageSize
    const data = db
      .prepare(`SELECT * FROM Bible WHERE ${whereSQL} LIMIT ${pageSize} OFFSET ${offset}`)
      .all() as TBible[]

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
