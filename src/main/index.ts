import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  clipboard,
  protocol,
  Menu,
  nativeImage,
  dialog
} from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
  TFindBible,
  TFindLexicalCodeFromBible,
  TFindHymn,
  TFindLexicon,
  TFindCommentary,
  TFindKeywordFromBible
} from '@shared/types.js'
import {
  findBible,
  findKeywordFromBible,
  findLexicalCodeFromBible
} from '@/repository/BibleRepository.js'
import { findLexicon } from './repository/LexiconRepository.js'
import { findHymn } from './repository/HymnRepository.js'
import icon from '../../resources/icon.ico?asset'
import { findCommentary } from './repository/CommentaryRepository.js'

const store = new Store()

let bibleVerseWindow: BrowserWindow | null = null
let lexiconWindow: BrowserWindow | null = null
let hymnWindow: BrowserWindow | null = null

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local', // 사용자 정의 프로토콜 이름
    privileges: {
      standard: true, // 일반적인 URL처럼 사용 가능 (e.g., <a href="myapp://home">)
      secure: true, // HTTPS 같은 보안 설정 적용
      bypassCSP: true, // Content Security Policy(CSP) 무시
      supportFetchAPI: true, // `fetch()` 및 `XMLHttpRequest` 사용 가능
      corsEnabled: true // CORS(교차 출처 리소스 공유) 지원
    }
  }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Grace Note',
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(fileURLToPath(new URL('../renderer/index.html', import.meta.url)))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('local', (request, callback) => {
    const url = path.join(app.getAppPath(), request.url.replace('local://', ''))
    callback({ path: url })
  })

  ipcMain.on('electron-store-get', async (event, val) => {
    event.returnValue = store.get(val)
  })
  ipcMain.on('electron-store-set', async (_, key, val) => {
    store.set(key, val)
  })
  ipcMain.on('show-context-menu', (_, elementType: string, imageUrl?: string) => {
    let menuTemplate: Electron.MenuItemConstructorOptions[] = []

    if (elementType === 'copyable-text') {
      menuTemplate = [{ label: '복사', role: 'copy' }]
    } else if (elementType === 'copyable-image' && imageUrl) {
      // 로컬 이미지 경로를 절대 경로로 변환
      let absolutePath = imageUrl

      if (imageUrl.startsWith('file://')) {
        absolutePath = fileURLToPath(imageUrl)
      } else if (!path.isAbsolute(imageUrl)) {
        absolutePath = path.join(app.getAppPath(), imageUrl.replace(/^local:\/\//, ''))
      }

      menuTemplate = [
        {
          label: '이미지 복사',
          click: (): void => {
            try {
              const image = nativeImage.createFromPath(absolutePath)
              if (!image.isEmpty()) {
                clipboard.writeImage(image)
              } else {
                console.error('Failed to load image:', absolutePath)
              }
            } catch (err) {
              console.error('Failed to copy image:', err)
            }
          }
        },
        {
          label: '이미지를 다른 이름으로 저장',
          click: async (): Promise<void> => {
            const { filePath } = await dialog.showSaveDialog({
              title: '이미지 저장',
              defaultPath: path.basename(imageUrl),
              filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }]
            })

            if (filePath) {
              fs.copyFile(absolutePath, filePath, (err) => {
                if (err) console.error('Failed to save image:', err)
              })
            }
          }
        }
      ]
    } else if (elementType === 'text-input') {
      menuTemplate = [{ label: '붙여넣기', role: 'paste' }]
    } else {
      return
    }

    const menu = Menu.buildFromTemplate(menuTemplate)
    menu.popup()
  })

  ipcMain.handle('findBible', (_, ...args: Parameters<TFindBible>) => findBible(...args))
  ipcMain.handle('findCommentary', (_, ...args: Parameters<TFindCommentary>) =>
    findCommentary(...args)
  )
  ipcMain.handle('findLexicon', (_, ...args: Parameters<TFindLexicon>) => findLexicon(...args))
  ipcMain.handle('findKeywordFromBible', (_, ...args: Parameters<TFindKeywordFromBible>) =>
    findKeywordFromBible(...args)
  )
  ipcMain.handle('findLexicalCodeFromBible', (_, ...args: Parameters<TFindLexicalCodeFromBible>) =>
    findLexicalCodeFromBible(...args)
  )
  ipcMain.handle('findHymn', (_, ...args: Parameters<TFindHymn>) => findHymn(...args))
  ipcMain.handle('getAudioFilePath', (_, fileName) => {
    const filePath =
      process.env.NODE_ENV === 'development'
        ? `local://${path.join('src', 'audios', fileName)}`
        : `file://${path.join(process.resourcesPath, `./audios/${fileName}`)}`

    return filePath
  })
  ipcMain.handle('getImageFilePath', (_, fileName) => {
    const filePath =
      process.env.NODE_ENV === 'development'
        ? `local://${path.join('src', 'images', fileName)}`
        : `file://${path.join(process.resourcesPath, `./images/${fileName}`)}`

    return filePath
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-bible-verse-window', async () => {
  if (bibleVerseWindow) {
    bibleVerseWindow.focus()
    return
  }

  bibleVerseWindow = new BrowserWindow({
    title: '성구 검색',
    width: 800,
    height: 670,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    bibleVerseWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/bible-verse`)
  } else {
    bibleVerseWindow.loadFile(fileURLToPath(new URL(`../renderer/index.html`, import.meta.url)), {
      hash: '#/bible-verse'
    })
  }

  bibleVerseWindow.on('closed', () => {
    bibleVerseWindow = null
  })
})

ipcMain.handle('open-lexicon-window', async () => {
  if (lexiconWindow) {
    lexiconWindow.focus()
    return
  }

  lexiconWindow = new BrowserWindow({
    title: '원어코드 검색',
    width: 800,
    height: 670,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    lexiconWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/lexicon`)
  } else {
    lexiconWindow.loadFile(fileURLToPath(new URL(`../renderer/index.html`, import.meta.url)), {
      hash: '#/lexicon'
    })
  }

  lexiconWindow.on('closed', () => {
    lexiconWindow = null
  })
})

ipcMain.handle('open-hymn-window', async () => {
  if (hymnWindow) {
    hymnWindow.focus()
    return
  }

  hymnWindow = new BrowserWindow({
    title: '새찬송가',
    width: 800,
    height: 670,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    hymnWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/hymn`)
  } else {
    hymnWindow.loadFile(fileURLToPath(new URL(`../renderer/index.html`, import.meta.url)), {
      hash: '#/hymn'
    })
  }

  hymnWindow.on('closed', () => {
    hymnWindow = null
  })
})
