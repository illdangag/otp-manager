import { useEffect, useState, } from 'react';
import { Button, Container, HStack, VStack, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import OtpURLModal from '../components/OtpURLModal';
import { BrowserStorage, } from '../utils';
import { Otp, } from '../../electron-src/interfaces';
import OtpItem from '../components/OtpItem';

const IndexPage = () => {

  const [isOpenOtpURLModal, setIsOpenOtpModal,] = useState<boolean>(false);
  const [otpList, setOtpList,] = useState<Otp[]>([]);

  useEffect(() => {
    const getOtpsHandler = (_event, args) => {
      console.log(args);
      setOtpList(args as Otp[]);
    };
    global.ipcRenderer.addListener('getOtps', getOtpsHandler);

    return () => {
      global.ipcRenderer.removeListener('getOtps', getOtpsHandler);
    };
  }, []);

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

  const onClickGetOtpList = () => {
    global.ipcRenderer.send('getOtps', {
      password: BrowserStorage.getPassword(),
    });
  };

  return (
    <Layout title='Home | Next.js + TypeScript + Electron Example'>
      <HStack>
        <Button onClick={onClickAddOtp}>추가</Button>
        <Button onClick={onClickClear}>초기화</Button>
        <Button onClick={onClickGetOtpList}>조회</Button>
      </HStack>
      <VStack
        // divider={<StackDivider borderColor='gray.200' />}
        // spacing={4}
        // align='stretch'
      >
        {otpList.map((item, index) => (
          <Container key={index}>
            <OtpItem otp={item}/>
          </Container>
        ))}
      </VStack>
      <OtpURLModal isOpen={isOpenOtpURLModal} onClose={onCloseOtpURLModal}/>
    </Layout>
  );
};

export default IndexPage;
