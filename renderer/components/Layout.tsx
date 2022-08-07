import React, { ReactNode, useEffect, useState, } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import MainPasswordModal from './MainPasswordModal';

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title',
}: Props) => {

  const [isOpenMainPasswordModal, setOpenMainPasswordModal,] = useState(false);

  useEffect(() => {
    const getSettingHandler = (_event, args) => {
      const isMainPassword: boolean = args.mainPassword;
      setOpenMainPasswordModal(!isMainPassword);
    };
    global.ipcRenderer.addListener('getSetting', getSettingHandler);
    global.ipcRenderer.send('getSetting');
    return () => {
      global.ipcRenderer.removeListener('getSetting', getSettingHandler);
    };
  }, []);

  const onCloseMainPasswordModal = () => {

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
