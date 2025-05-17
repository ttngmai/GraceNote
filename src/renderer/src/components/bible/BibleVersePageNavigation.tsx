import tw from 'twin.macro'
import NavigationBar from '../common/NavigationBar'
import BibleVerseSearch from './BibleVerseSearch'

export default function BibleVersePageNavigation(): JSX.Element {
  return (
    <NavigationBar sx={tw`h-90pxr`}>
      <BibleVerseSearch />
    </NavigationBar>
  )
}
