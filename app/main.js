const { app, BrowserWindow, shell, Tray, Menu } = require('electron');
const path = require('path');
let mainWindow = null;
let tray = null;

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    show: false,
    width: 784,
    height: 557,
    resizable: false
  });
  mainWindow.loadFile(path.join(__dirname + '/assets/index.html'));

  mainWindow.on('ready-to-show', mainWindow.show);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('amazon')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const contextMenuMainWindow = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
      ]
    }
  ]);
  Menu.setApplicationMenu(contextMenuMainWindow);

  tray = new Tray(path.join(__dirname + '/assets/images/icon-16x16.png'));
  tray.setToolTip('Price Checker');
  const contextMenuTray = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Terminate', click: () => app.quit() }
  ]);
  tray.setContextMenu(contextMenuTray);

  mainWindow.on('close', e => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => win.show());

app.on('before-quit', () => app.quitting = true);
