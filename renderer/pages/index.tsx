import { useEffect, useState, } from 'react';
import { Container, VStack, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Otp, } from '../../electron-src/interfaces';
import OtpItem from '../components/OtpItem';

const IndexPage = () => {

  const [otpList, setOtpList,] = useState<Otp[]>([]);

  useEffect(() => {
    const getOtpListHandler = (_event, args) => {
      setOtpList(args as Otp[]);
    };
    global.ipcRenderer.addListener('getOtpList', getOtpListHandler);

    return () => {
      global.ipcRenderer.removeListener('getOtpList', getOtpListHandler);
    };
  }, []);

  return (
    <Layout title='OTP Manager'>
      <VStack>
        {otpList.map((item, index) => (
          <Container key={index}>
            <OtpItem otp={item}/>
          </Container>
        ))}
      </VStack>
    </Layout>
  );
};

export default IndexPage;
