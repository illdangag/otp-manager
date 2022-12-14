// Native
import { join, } from 'path';
import { format, } from 'url';
import Store from 'electron-store';
import log from 'electron-log';

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, Tray, nativeImage, MenuItemConstructorOptions, clipboard, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import { v4, } from 'uuid';

import { ClearRequest, ClearResponse, CreateOtpRequest, CreateOtpResponse, DeleteOtpRequest, DeleteOtpResponse, GetOtpListRequest,
  GetOtpListResponse, MainPasswordRequest, MainPasswordResponse, Otp, OtpCode, OtpTrayMenuRequest, PasswordStatusType, UpdateOtpRequest,
  UpdateOtpResponse, ValidatePasswordRequest, ValidatePasswordResponse, OtpSwapRequest, OtpSwapResponse, } from './interfaces';
import { decrypt, encrypt, } from './utils';

const store = new Store();

const PASSWORD_VALIDATE: string = 'passwordValidate';

const trayIconBase64: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAhElEQVQ4y83SvQ2DQAyG4atuCtiHggVuIGaiu2FA1JGguupJhxQl4UcJSt7uk/zaluUQPkcrWyyy9kh5B4oCuv3u3CRRlNzYmSIjrSkhbwuzIq4pKuZtgekhT3xL0Bi9Y9Q8C4MthlfLbPJroVep9MeFOoQQ1BcKp1f6k7Oefo2zz3cZd9lz9fporhaNAAAAAElFTkSuQmCC';
let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  mainWindow = new BrowserWindow({
    width: 420,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
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
  const icon = nativeImage.createFromDataURL(trayIconBase64);
  tray = new Tray(icon);

  log.debug('[Application Start]');
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
  log.debug('[Application End]');
});

/**
 * ???????????? ??????
 * - ??????????????? ?????? ???????????? ?????? ?????? ??????????????? ??????????????? ?????? ?????? ?????? OTP ??????????????? ??????
 */
ipcMain.on('setMainPassword', (event: IpcMainEvent, request: MainPasswordRequest) => {
  const password: string = request.password;

  // ????????? ??????????????? ?????? ???????????? ????????? ????????? ??????
  // ???????????? ????????? ???????????? ?????? ???????????? ???????????? ?????? ?????? ????????? ??????????????? ??????
  const encryptedPassword: string = encrypt(PASSWORD_VALIDATE, password);
  store.set('encryptedPassword', encryptedPassword);
  store.delete('opts');

  // ???????????? ?????? ?????? ??????
  const response: MainPasswordResponse = {
    error: null, // ??????????????? ?????? ???????????? ???????????? ????????? ????????? ???????????? ??????
  };
  const callbackChannel: string = request.callbackChannel || 'setMainPassword';
  event.sender.send(callbackChannel, response);
});

/**
 * ???????????? ??????
 * - ?????? ???????????? ???????????? ??? ??????????????? ????????? ?????? ???, ??????????????? ???????????? ?????? ?????? ????????? ??????????????? ??????
 */
ipcMain.on('validatePassword', (event: IpcMainEvent, request: ValidatePasswordRequest) => {
  const password: string = request.password;
  const response: ValidatePasswordResponse = {
    error: null,
    type: validatePassword(password),
    otpList: getOtpList(password, true),
  };
  const callbackChannel: string = request.callbackChannel || 'validatePassword';
  event.sender.send(callbackChannel, response);
});

/**
 * ???????????? ??? OTP ????????? ??????
 * - ???????????? ??????????????? ???????????? ???????????? ???????????? ????????? ???????????? ???????????? ????????? ?????? ?????? ???????????? ??????
 */
ipcMain.on('clear', (event: IpcMainEvent, request: ClearRequest) => {
  log.debug('[clear]');
  store.clear();
  const response: ClearResponse = {
    error: null,
  };
  const callbackChannel: string = request.callbackChannel || 'clear';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP ??????
 */
ipcMain.on('createOtp', (event: IpcMainEvent, request: CreateOtpRequest) => {
  log.debug('[createOtp]');
  const password: string = request.password; // TODO ???????????? ??????
  const otp: Otp = request.otp;
  otpTrim(otp);

  const newOtpList: Otp[] = pushOtpList(password, otp, true);
  const response: CreateOtpResponse = {
    error: null,
    otpList: newOtpList,
  };
  const callbackChannel: string = request.callbackChannel || 'createOtp';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP ?????? ??????
 */
ipcMain.on('getOtpList', (event: IpcMainEvent, request: GetOtpListRequest) => {
  // log.debug('[getOtpList]');
  const password: string = request.password;

  const passwordStatusType: PasswordStatusType = validatePassword(password);
  const response: GetOtpListResponse = {
    error: null,
    otpList: passwordStatusType === 'VALIDATE' ? getOtpList(password, true) : [],
    passwordStatusType,
  };
  const callbackChannel: string = request.callbackChannel || 'getOtpList';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP ??????
 */
ipcMain.on('updateOtp', (event: IpcMainEvent, request: UpdateOtpRequest) => {
  log.debug('[updateOtp]');
  const password: string = request.password; // TODO ???????????? ??????
  const updateOtp: Otp = request.otp;
  otpTrim(updateOtp);

  const otpList: Otp[] = getOtpList(password, false);
  const index: number = otpList.findIndex(item => item.id === updateOtp.id!);
  otpList[index].issuerDescription = updateOtp.issuerDescription;
  otpList[index].userDescription = updateOtp.userDescription;
  otpList[index].description = updateOtp.description;
  store.set('otpList', otpList);

  const response: UpdateOtpResponse = {
    error: null,
    otpList: getOtpList(password, true),
  };
  const callbackChannel: string = request.callbackChannel || 'updateOtp';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP ??????
 */
ipcMain.on('deleteOtp', (event: IpcMainEvent, request: DeleteOtpRequest) => {
  log.debug('[deleteOtp]');
  const password: string = request.password; // TODO ???????????? ??????

  const deleteOtpId: string = request.id;
  const optList: Otp[] = getOtpList(password, false);
  const deletedOtpList: Otp[] = optList.filter(item => item.id !== deleteOtpId);
  store.set('otpList', deletedOtpList);

  const response: DeleteOtpResponse = {
    error: null,
    otpList: getOtpList(password, true),
  };
  const callbackChannel: string = request.callbackChannel || 'deleteOtp';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP ?????? ??????
 */
ipcMain.on('swapOtp', (event: IpcMainEvent, request: OtpSwapRequest) => {
  log.debug('[swapOtp]');
  const password: string = request.password;
  const from: number = request.from;
  const to: number = request.to;
  const otpList: Otp[] = getOtpList(password, false);
  const newOtpList: Otp[]  = otpList.splice(from, 1);
  otpList.splice(to, 0, newOtpList[0]);
  store.set('otpList', otpList);

  const response: OtpSwapResponse = {
    error: null,
  };
  const callbackChannel: string = request.callbackChannel || 'swapOtp';
  event.sender.send(callbackChannel, response);
});

ipcMain.on('setTrayMenu', (_event: IpcMainEvent, request: OtpTrayMenuRequest) => {
  const password: string = request.password;
  const passwordStatusType: PasswordStatusType = validatePassword(password);

  let optionList: MenuItemConstructorOptions[] | null = null;
  if (tray == null) {
    return;
  }

  if (!request.otpCodeList || passwordStatusType === 'NOT_SETTING' || passwordStatusType === 'INVALIDATE') {
    optionList = [];
  } else {
    const otpCodeList: OtpCode[] = request.otpCodeList;
    optionList = otpCodeList.map(item => {
      const otp: Otp = item.otp;
      const label: string = `${otp.issuerDescription ? otp.issuerDescription : otp.issuer}(${otp.userDescription ? otp.userDescription : otp.user}) - ${item.code}`;
      return {
        label,
        type: 'normal',
        click: async () => {
          clipboard.writeText(item.code);
        },
      } as MenuItemConstructorOptions;
    });
  }

  if (passwordStatusType === 'NOT_SETTING') {
    optionList.push({
      label: 'OTP ?????? ??????',
      type: 'normal',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    });
  } else if (passwordStatusType === 'INVALIDATE') {
    optionList.push({
      label: '?????????',
      type: 'normal',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    });
  }

  optionList.push(
    {
      type: 'separator',
    },
    {
      label: '??????',
      type: 'normal',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    {
      label: '??????',
      type: 'normal',
      click: () => {
        mainWindow?.close();
      },
    },
  );
  const menu = Menu.buildFromTemplate(optionList);
  tray.setContextMenu(menu);
});

/////////////////////////////////

const pushOtpList = (password: string, otp: Otp, isDecrypt: boolean = true): Otp[] => {
  otp.id = v4();
  otp.secret = encrypt(otp.secret, password);
  const otpListData = store.get('otpList');
  const otpList: Otp[] = otpListData ? otpListData as Otp[] : [];
  otpList.push(otp);
  store.set('otpList', otpList);
  return getOtpList(password, isDecrypt);
};

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
  return passwordStatusType;
};

const otpTrim = (otp: Otp): void => {
  otp.issuerDescription = otp.issuerDescription.trim();
  otp.userDescription = otp.userDescription.trim();
  otp.description = otp.description.trim();
};
