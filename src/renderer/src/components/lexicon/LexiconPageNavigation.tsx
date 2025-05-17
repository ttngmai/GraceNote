import tw from 'twin.macro'
import NavigationBar from '../common/NavigationBar'
import LexicalCodeSearch from './LexicalCodeSearch'

export default function LexiconPageNavigation(): JSX.Element {
  return (
    <NavigationBar sx={tw`h-90pxr`}>
      <LexicalCodeSearch />
    </NavigationBar>
  )
}
