import { Otp, } from '../../electron-src/interfaces';

class BrowserStorage {
  static clear (): void {
    localStorage.clear();
  }

  static getPassword (): string {
    const passwordValue: string = localStorage.getItem('password');
    if (passwordValue == null) {
      return '';
    }

    const value: any = JSON.parse(passwordValue);
    if (Date.now() > value.expire) { // 기준 시간이 지난 경우
      localStorage.removeItem('password'); // 비밀번호 삭제
      return '';
    } else {
      return value.password;
    }
  }

  static setPassword (password: string): void {
    const value: any = {
      password,
      expire: Date.now() + 12 * 60 * 60 * 1000, // 12시간 후 삭제
      // expire: Date.now() + 3 * 1000, // 3초 후 삭제, 개발 및 테스트 용
    };
    localStorage.setItem('password', JSON.stringify(value));
  }
}

const getOTPData = (data: string): Otp => {
  if (data.indexOf('otpauth://totp/') === -1) {
    throw Error('is not otp data');
  }

  let user: string = '';
  let secret: string = '';
  let issuer: string = '';

  const otpAuthData: String[] = data.split('otpauth://totp/');
  if (otpAuthData.length !== 2) {
    throw Error('is not otp data');
  }

  user = decodeURIComponent(otpAuthData[1].split('?')[0]);

  const queryString: string = otpAuthData[1].split('?')[1];
  const keyValueList: string[] = queryString.split('&');
  for (const keyValue of keyValueList) {
    const data: string[] = keyValue.split('=');
    const key: string = data[0];
    const value: string = data[1];
    if (key.toLocaleLowerCase() === 'secret') {
      secret = decodeURIComponent(value);
    } else if (key.toLocaleLowerCase() === 'issuer') {
      issuer = decodeURIComponent(value);
    }
  }

  return {
    user,
    secret,
    issuer,
    userDescription: '',
    issuerDescription: '',
    description: '',
  };
};

export { BrowserStorage, getOTPData, };
