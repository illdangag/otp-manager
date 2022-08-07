// Native
import { join, } from 'path';
import { format, } from 'url';
import Store from 'electron-store';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

const store = new Store();

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  void await mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  store.delete('mainPassword');
  app.quit();
});

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});

ipcMain.on('getSetting', (event: IpcMainEvent, _message: any) => {
  const mainPassword: string = store.get('mainPassword') as string;
  event.sender.send('getSetting', {
    mainPassword: mainPassword && mainPassword !== '' ? true : false,
  });
});

ipcMain.on('setMainPassword', (event: IpcMainEvent, message: any) => {
  store.set('mainPassword', message);
  store.delete('opts');
  event.sender.send('setMainPassword', {
    result: true,
  });
});
