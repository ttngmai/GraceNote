import * as Label from '@radix-ui/react-label'
import { hymnAtom, hymnPageViewModeAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import Button from '../common/Button'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'

export default function HymnNumberSearch(): JSX.Element {
  const setHymn = useSetAtom(hymnAtom)
  const setHymnPageViewModeAtom = useSetAtom(hymnPageViewModeAtom)

  const [keyword, setKeyword] = useState<string>('')

  const handleSearchHymn = async (): Promise<void> => {
    const result = await window.context.findHymn(keyword.trim())
    if (result && result.length > 0) {
      setHymn(result[0])
      setHymnPageViewModeAtom('score')
    }
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchHymn()
    }
  }

  return (
    <div className="flex items-center shrink-0 w-fit gap-8pxr">
      <input
        type="text"
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleEnterKey}
        value={keyword}
        id="keyword"
        className="inline-flex justify-center items-center w-80pxr p-4pxr border border-gray-300 rounded-md text-center"
      ></input>
      <Label.Root className="font-bold" htmlFor="keyword">
        장
      </Label.Root>
      <Button type="button" onClick={handleSearchHymn} size="icon">
        <IconSearch size={18} />
      </Button>
    </div>
  )
}
