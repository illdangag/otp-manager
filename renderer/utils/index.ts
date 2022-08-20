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

export { BrowserStorage, };
