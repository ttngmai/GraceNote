import { TBible } from '@shared/models'
import { FindLexicalCodeFromBibleParams, TPagedResult } from '@shared/types'

export const fetchLexicons = async ({
  pageParam = 1,
  ...params
}: FindLexicalCodeFromBibleParams & { pageParam?: number }): Promise<TPagedResult<TBible>> => {
  const result = await window.context.findLexicalCodeFromBible({ ...params, page: pageParam })

  return result
}
