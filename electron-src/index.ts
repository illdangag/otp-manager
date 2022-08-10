// Native
import { join, } from 'path';
import { format, } from 'url';
import Store from 'electron-store';

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

import { Otp, PasswordStatus, } from './interfaces';
import { decrypt, encrypt, } from './cryptoUtils';

const store = new Store();

const PASSWORD_VALIDATE: string = 'passwordValidate';

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

ipcMain.on('clear', (_event: IpcMainEvent, _args: any) => {
  console.log('clear');
  store.clear();
});

ipcMain.on('getSetting', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const encryptedPassword: string | undefined = store.get('encryptedPassword') as string;

  const passwordStatus: PasswordStatus = {
    type: 'NOT_SETTING',
  };

  if (encryptedPassword !== undefined) {
    try {
      const decryptedPassword: string = decrypt(encryptedPassword, password);
      passwordStatus.type = decryptedPassword === PASSWORD_VALIDATE ? 'VALIDATE' : 'INVALIDATE';
    } catch {
      passwordStatus.type = 'INVALIDATE';
    }
  }

  console.log(password, passwordStatus);
  event.sender.send('getSetting', passwordStatus);
});

ipcMain.on('setMainPassword', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const encryptedPassword: string = encrypt(PASSWORD_VALIDATE, password);
  store.set('encryptedPassword', encryptedPassword);
  store.delete('opts');
  event.sender.send('setMainPassword', {
    result: true,
  });
});

ipcMain.on('setOtp', (event: IpcMainEvent, args: any) => {
  const otp: Otp = args.otp;
  const password: string = args.password;

  otp.id = uuidv4();
  otp.secret = encrypt(otp.secret, password);

  const otpsData = store.get('otps');
  const otps: Otp[] = otpsData ? otpsData as Otp[] : [];
  otps.push(otp);
  console.log(otps);
  store.set('otps', otps);
  event.sender.send('setOtp', {
    result: true,
  });
});

ipcMain.on('getOtps', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const otpsData = store.get('otps');
  console.log(otpsData);
  if (otpsData == null) {
    event.sender.send('getOtps', []);
  } else {
    const otps: Otp[] = otpsData ? otpsData as Otp[] : [];
    try {
      for (let opt of otps) {
        opt.secret = decrypt(opt.secret, password);
      }
    } catch {
      event.sender.send('getOtps', []);
      return;
    }
    event.sender.send('getOtps', otps);
  }
});

const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
