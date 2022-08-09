class BrowserStorage {
  static clear(): void {
    localStorage.clear();
  }

  static getPassword(): string {
    const passwordValue: string = localStorage.getItem('password');
    if (passwordValue == null) {
      return '';
    }

    const value: any = JSON.parse(passwordValue);
    if (Date.now() > value.expire) {
      localStorage.removeItem('password');
      return '';
    } else {
      return value.password;
    }
  }

  static setPassword(password: string): void {
    const value: any = {
      password,
      expire: Date.now() + 12 * 60 * 60 * 1000, // 12시간 후 삭제
    };
    localStorage.setItem('password', JSON.stringify(value));
  }
}

export { BrowserStorage, };
