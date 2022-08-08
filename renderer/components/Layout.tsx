import React, { ReactNode, useEffect, useState, } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import MainPasswordModal from './MainPasswordModal';
import { PasswordStatus, } from '../../electron-src/interfaces';

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title',
}: Props) => {

  const [password, setPassword,] = useState('');
  const [isOpenMainPasswordModal, setOpenMainPasswordModal,] = useState(false);

  useEffect(() => {
    const getSettingHandler = (_event, args) => {
      const passwordStatus: PasswordStatus = args;
      console.log(passwordStatus);
      if (passwordStatus.type === 'NOT_SETTING') {
        setOpenMainPasswordModal(true);
      }
    };
    global.ipcRenderer.addListener('getSetting', getSettingHandler);
    global.ipcRenderer.send('getSetting', {
      password,
    });
    return () => {
      global.ipcRenderer.removeListener('getSetting', getSettingHandler);
    };
  }, []);

  const onCloseMainPasswordModal = () => {
    setOpenMainPasswordModal(false);
  };

  return  (
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
          </Link>{' '}
          |{' '}
          <Link href='/otp/list'>
            <a>OTP list</a>
          </Link>{' '}
          |{' '}
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
    </div>
  );
};

export default Layout;
