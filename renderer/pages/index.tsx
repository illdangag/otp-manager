import { useEffect, useState, } from 'react';
import { Container, VStack, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Otp, OtpCode, } from '../../electron-src/interfaces';
import OtpItem from '../components/OtpItem';
import totp from 'totp-generator';
import { useInterval } from 'usehooks-ts'

const IndexPage = () => {

  const [otpList, setOtpList,] = useState<Otp[]>([]);
  const [otpCodeList, setOtpCodeList,] = useState<OtpCode[]>([]);
  const intervalTime: number = 100;

  useEffect(() => {
    const getOtpListHandler = (_event, args) => {
      setOtpList(args as Otp[]);
    };
    global.ipcRenderer.addListener('getOtpList', getOtpListHandler);

    return () => {
      global.ipcRenderer.removeListener('getOtpList', getOtpListHandler);
    };
  }, []);

  useInterval(() => {
    const newOtpCodeList: OtpCode[] = otpList.map(item => getOTPCode(item, otpCodeList));
    setOtpCodeList(newOtpCodeList);
  }, intervalTime);

  function getOTPCode (otp: Otp, otpCodeList: OtpCode[]): OtpCode {
    const now: Date = new Date();
    const time: number = now.getSeconds() * 1000 + now.getMilliseconds();

    const index: number = otpCodeList.findIndex(item => item.id === otp.id);
    let code: string = '';
    if (index === -1) {
      code = totp(otp.secret);
    } else {
      if ((time % (30 * 1000)) <= intervalTime) {
        code = totp(otp.secret);
      } else {
        code = otpCodeList[index].code;
      }
    }

    return {
      id: otp.id,
      issuer: otp.issuer,
      user: otp.user,
      code: code,
      progress: (time % 30000) / 30000 * 100,
    };
  }

  return (
    <Layout title='OTP Manager'>
      <VStack>
        {otpCodeList.map((item, index) => (
          <Container key={index}>
            <OtpItem otpCode={item}/>
          </Container>
        ))}
      </VStack>
    </Layout>
  );
};

export default IndexPage;
