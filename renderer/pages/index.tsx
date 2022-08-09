import { useEffect, useState, } from 'react';
import Link from 'next/link';
import { Button, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import OtpURLModal from '../components/OtpURLModal';
import { BrowserStorage, } from '../utils';

const IndexPage = () => {

  const [isOpenOtpURLModal, setIsOpenOtpModal,] = useState(false);

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', handleMessage);

    return () => {
      global.ipcRenderer.removeListener('message', handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send('message', 'hi from next');
  };

  const onClickAddOtp = () => {
    setIsOpenOtpModal(true);
  };

  const onClickClear = () => {
    global.ipcRenderer.send('clear', {});
    BrowserStorage.clear();
  };

  const onCloseOtpURLModal = () => {
    setIsOpenOtpModal(false);
  };

  return (
    <Layout title='Home | Next.js + TypeScript + Electron Example'>
      <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <Button onClick={onClickAddOtp}>추가</Button>
      <Button onClick={onClickClear}>초기화</Button>
      <p>
        <Link href='/about'>
          <a>About</a>
        </Link>
      </p>
      <OtpURLModal isOpen={isOpenOtpURLModal} onClose={onCloseOtpURLModal}/>
    </Layout>
  );
};

export default IndexPage;