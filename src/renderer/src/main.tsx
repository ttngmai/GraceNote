import 'pretendard/dist/web/variable/pretendardvariable.css'
import './assets/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import MainPage from './pages/MainPage'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { createStore, Provider } from 'jotai'
import HymnPage from './pages/HymnPage'
import GlobalContextMenu from './components/common/GlobalContextMenu'
import LexiconPage from './pages/LexiconPage'
import BibleVersePage from './pages/BibleVersePage'

const rootStore = createStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <GlobalContextMenu />
      <HashRouter>
        <Routes>
          <Route path="/" Component={MainPage} />
          <Route path="/hymn" Component={HymnPage} />
          <Route path="/bible-verse" Component={BibleVersePage} />
          <Route path="/lexicon" Component={LexiconPage} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>
)
