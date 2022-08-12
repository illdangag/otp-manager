// Native
import { join, } from 'path';
import { format, } from 'url';
import Store from 'electron-store';
import log from 'electron-log';

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

import { Otp, PasswordStatus, PasswordStatusType, } from './interfaces';
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
  log.debug('Application Start');
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
  log.debug('Application End');
});

ipcMain.on('clear', (_event: IpcMainEvent, _args: any) => {
  log.debug('clear application storage');
  store.clear();
});

ipcMain.on('getSetting', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const passwordStatus: PasswordStatus = {
    type: validatePassword(password),
  };
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

  const otpListData = store.get('otpList');
  const otpList: Otp[] = otpListData ? otpListData as Otp[] : [];
  otpList.push(otp);
  store.set('otpList', otpList);
  event.sender.send('setOtp', {
    result: true,
  });
});

ipcMain.on('getOtpList', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  event.sender.send('getOtpList', getOtpList(password));
});

ipcMain.on('getOtp', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const otpId: string = args.id;

  const passwordStatusType: PasswordStatusType = validatePassword(password);
  if (passwordStatusType !== 'VALIDATE') {
    event.sender.send('getSetting', passwordStatusType);
    return;
  }

  event.sender.send('getOtp', {
    otp: getOtp(password, otpId),
  });
});

ipcMain.on('updateOtp', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const passwordStatusType: PasswordStatusType = validatePassword(password);
  if (passwordStatusType !== 'VALIDATE') {
    event.sender.send('getSetting', passwordStatusType);
    return;
  }

  const newOtp: Otp = args.otp as Otp;
  const otpList: Otp[] = getOtpList(password, false);
  const index: number = otpList.findIndex(item => item.id === newOtp.id!);
  otpList[index].issuerDescription = newOtp.issuerDescription;
  otpList[index].userDescription = newOtp.userDescription;
  store.set('otpList', otpList);
  event.sender.send('updateOtp', {
    error: null,
  });
});

ipcMain.on('deleteOtp', (event: IpcMainEvent, args: any) => {
  const password: string = args.password;
  const passwordStatusType: PasswordStatusType = validatePassword(password); // TODO 비밀번호 검증 실패한 경우 처리
  log.debug(passwordStatusType);

  const deleteOtpId: string = args.id;
  const optList: Otp[] = getOtpList(password, false);
  const deletedOtpList: Otp[] = optList.filter(item => item.id !== deleteOtpId);
  store.set('otpList', deletedOtpList);
  event.sender.send('deleteOtp', {
    error: null,
  });
});

/////////////////////////////////

const getOtpList = (password: string, isDecrypt: boolean = true): Otp[] => {
  const otpListData = store.get('otpList');
  if (otpListData == null) {
    return [];
  } else {
    const otpList: Otp[] = otpListData ? otpListData as Otp[] : [];
    try {
      for (let opt of otpList) {
        if (isDecrypt) {
          opt.secret = decrypt(opt.secret, password);
        }
      }
    } catch {
      return [];
    }
    return otpList;
  }
};

const getOtp = (password: string, id: string, isDecrypt: boolean = true): Otp | null => {
  const otpList: Otp[] = getOtpList(password, isDecrypt);
  const index: number = otpList.findIndex(item => item.id === id);
  if (index < 0) {
    return null;
  } else {
    return otpList[index];
  }
};

const validatePassword = (password: string): PasswordStatusType => {
  const encryptedPassword: string | undefined = store.get('encryptedPassword') as string;
  let passwordStatusType: PasswordStatusType = 'NOT_SETTING';
  if (encryptedPassword !== undefined) {
    try {
      const decryptedPassword: string = decrypt(encryptedPassword, password);
      return decryptedPassword === PASSWORD_VALIDATE ? 'VALIDATE' : 'INVALIDATE';
    } catch {
      return 'INVALIDATE';
    }
  }
  log.debug(passwordStatusType);
  return passwordStatusType;
};

// TODO utils로 이동
const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
