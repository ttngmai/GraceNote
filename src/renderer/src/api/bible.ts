import { TBible } from '@shared/models'
import { BibleVerseSearchCondition, TPagedResult } from '@shared/types'

export const fetchBibleVerses = async ({
  pageParam = 1,
  ...params
}: BibleVerseSearchCondition & { pageParam?: number }): Promise<TPagedResult<TBible>> => {
  const result = await window.context.findKeywordFromBible({ ...params, page: pageParam })

  return result
}
