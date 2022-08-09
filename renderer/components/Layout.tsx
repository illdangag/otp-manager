import React, { ReactNode, useEffect, useState, } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import MainPasswordModal from './MainPasswordModal';
import { PasswordStatus, } from '../../electron-src/interfaces';
import PasswordModal from './PasswordModal';
import { BrowserStorage, } from '../utils';

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title',
}: Props) => {

  const [isOpenMainPasswordModal, setOpenMainPasswordModal,] = useState(false);
  const [isOpenPasswordModal, setOpenPasswordModal,] = useState(false);

  useEffect(() => {

    const getSettingHandler = (_event, args) => {
      const passwordStatus: PasswordStatus = args as PasswordStatus;
      console.log(passwordStatus);
      if (passwordStatus.type === 'NOT_SETTING') {
        setOpenMainPasswordModal(true);
      } else if (passwordStatus.type === 'INVALIDATE') {
        setOpenPasswordModal(true);
      }
    };

    global.ipcRenderer.addListener('getSetting', getSettingHandler);

    const storagePassword = BrowserStorage.getPassword();
    console.log(storagePassword);
    global.ipcRenderer.send('getSetting', {
      password: storagePassword,
    });

    return () => {
      global.ipcRenderer.removeListener('getSetting', getSettingHandler);
    };
  }, []);

  const onCloseMainPasswordModal = () => {
    setOpenMainPasswordModal(false);
  };

  const onClosePasswordModal = () => {
    setOpenPasswordModal(false);
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <header>
        <nav>
          <Link href='/'>
            <a>Home</a>
          </Link>
          {' '}|{' '}
          <Link href='/otp/list'>
            <a>OTP list</a>
          </Link>
          {' '}|{' '}
          <Link href='/otp/setting'>
            <a>OTP Setting</a>
          </Link>
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
      <MainPasswordModal isOpen={isOpenMainPasswordModal} onClose={onCloseMainPasswordModal}/>
      <PasswordModal isOpen={isOpenPasswordModal} onClose={onClosePasswordModal}/>
    </div>
  );
};

export default Layout;
