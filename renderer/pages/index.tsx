import { useEffect, useState, } from 'react';
import { Container, VStack, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Otp, } from '../../electron-src/interfaces';
import OtpItem from '../components/OtpItem';

const IndexPage = () => {

  const [otpList, setOtpList,] = useState<Otp[]>([]);

  useEffect(() => {
    const getOtpsHandler = (_event, args) => {
      setOtpList(args as Otp[]);
    };
    global.ipcRenderer.addListener('getOtps', getOtpsHandler);

    return () => {
      global.ipcRenderer.removeListener('getOtps', getOtpsHandler);
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
