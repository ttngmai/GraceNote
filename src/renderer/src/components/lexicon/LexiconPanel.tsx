import { panelTextSizeAtom, lexicalCodeAtom } from '@renderer/store'
import { TLexicon } from '@shared/models'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

type LexiconPanelProps = {
  version: string
  backgroundColor: string
  textColor: string
}

export default function LexiconPanel({
  version,
  backgroundColor,
  textColor
}: LexiconPanelProps): JSX.Element {
  const panelTextSize = useAtomValue(panelTextSizeAtom)
  const lexicalCode = useAtomValue(lexicalCodeAtom)

  const [lexiconData, setLexiconData] = useState<TLexicon[]>()

  useEffect(() => {
    const fetchLexicon = async (): Promise<void> => {
      const result = await window.context.findLexicon(version, lexicalCode)
      setLexiconData(result)
    }
    if (lexicalCode) fetchLexicon()
  }, [version, lexicalCode])

  return (
    <div className="overflow-y-auto" style={{ backgroundColor }}>
      {lexiconData && (
        <div className={`px-16pxr text-[${panelTextSize}px]`} style={{ color: textColor }}>
          <div className="flex">
            <span className="inline-flex items-center mr-[0.5em] text-[0.8em] text-brand-blue-500">
              {lexiconData[0]?.code}
            </span>
            <span
              style={{
                fontFamily: lexiconData[0]?.code?.[0] === 'H' ? 'Noto Serif Hebrew' : 'Noto Serif'
              }}
              className="text-[1.75em]"
            >
              {lexiconData[0]?.word}
            </span>
          </div>
          <div>
            <span dangerouslySetInnerHTML={{ __html: lexiconData[0]?.definition }}></span>
          </div>
        </div>
      )}
      <div className="h-screen" />
    </div>
  )
}
