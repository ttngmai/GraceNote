import { THymn } from '@shared/models'
import { FindKeywordFromHymnParams, TPagedResult } from '@shared/types'

export const fetchHymns = async ({
  pageParam = 1,
  ...params
}: FindKeywordFromHymnParams & { pageParam?: number }): Promise<TPagedResult<THymn>> => {
  const result = await window.context.findKeywordFromHymn({ ...params, page: pageParam })

  return result
}
