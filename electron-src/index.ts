// Native
import { join, } from 'path';
import { format, } from 'url';
import Store from 'electron-store';
import log from 'electron-log';

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import { v4, } from 'uuid';

import {
  ClearRequest,
  ClearResponse,
  CreateOtpRequest,
  CreateOtpResponse,
  DeleteOtpRequest,
  DeleteOtpResponse,
  GetOtpListRequest,
  GetOtpListResponse,
  MainPasswordRequest,
  MainPasswordResponse,
  Otp,
  PasswordStatusType,
  UpdateOtpRequest,
  UpdateOtpResponse,
  ValidatePasswordRequest,
  ValidatePasswordResponse,
} from './interfaces';
import { decrypt, encrypt, } from './cryptoUtils';

const store = new Store();

const PASSWORD_VALIDATE: string = 'passwordValidate';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  const mainWindow = new BrowserWindow({
    width: 420,
    height: 680,
    resizable: false,
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
  log.debug('[Application Start]');
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
  log.debug('[Application End]');
});

/**
 * 메인 비밀번호 설정
 * - 메인 비밀번호를 새로 설정하게 하면 이전 비밀번호로 암호화되어 등록 되어 있는 OTP 데이터들을 삭제
 */
ipcMain.on('setMainPassword', (event: IpcMainEvent, request: MainPasswordRequest) => {
  const password: string = request.password;

  // 설정할 비밀번호로 상수 문자열을 암호화 하여서 저장
  // 비밀번호 검증은 암호화된 상수 문자열을 복호화에 성공 하면 유효한 비밀번호라 판단
  const encryptedPassword: string = encrypt(PASSWORD_VALIDATE, password);
  store.set('encryptedPassword', encryptedPassword);
  store.delete('opts');

  // 비밀번호 설정 여부 반환
  const response: MainPasswordResponse = {
    error: null, // 비밀번호를 새로 설정하는 경우에는 오류의 상황이 존재하지 않음
  };
  const callbackChannel: string = request.callbackChannel || 'setMainPassword';
  event.sender.send(callbackChannel, response);
});

/**
 * 비밀번호 검증
 * - 상수 문자열을 확인해야 할 비밀번호로 복호화 시도 후, 정상적으로 복호화가 되는 경우 유효한 비밀번호로 판단
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
 * 비밀번호 및 OTP 데이터 삭제
 * - 사용자가 비밀번호를 잊어버린 상황에서 사용하는 경우를 고려하여 비밀번호 검증을 하지 않고 데이터를 삭제
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
 * OTP 추가
 */
ipcMain.on('createOtp', (event: IpcMainEvent, request: CreateOtpRequest) => {
  log.debug('[createOtp]', request);
  const password: string = request.password; // TODO 비밀번호 검증
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
 * OTP 목록 조회
 */
ipcMain.on('getOtpList', (event: IpcMainEvent, request: GetOtpListRequest) => {
  log.debug('[getOtpList]', request);
  const password: string = request.password; // TODO 비밀번호 검증
  const response: GetOtpListResponse = {
    error: null,
    otpList: getOtpList(password, true),
  };
  const callbackChannel: string = request.callbackChannel || 'getOtpList';
  event.sender.send(callbackChannel, response);
});

/**
 * OTP 갱신
 */
ipcMain.on('updateOtp', (event: IpcMainEvent, request: UpdateOtpRequest) => {
  log.debug('[updateOtp]', request);
  const password: string = request.password; // TODO 비밀번호 검증
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
 * OTP 삭제
 */
ipcMain.on('deleteOtp', (event: IpcMainEvent, request: DeleteOtpRequest) => {
  log.debug('[deleteOtp]', request);
  const password: string = request.password; // TODO 비밀번호 검증

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
  log.debug(passwordStatusType);
  return passwordStatusType;
};

const otpTrim = (otp: Otp): void => {
  otp.issuerDescription = otp.issuerDescription.trim();
  otp.userDescription = otp.userDescription.trim();
  otp.description = otp.description.trim();
};
