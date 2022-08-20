// react, element
import { useEffect, useState, } from 'react';
import { Container, VStack, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import OtpItem from '../components/OtpItem';
import OtpEmpty from '../components/OtpEmpty';

// state management
import { useRecoilValue, useRecoilState, useSetRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, otpListAtom, passwordModalStateAtom, } from '../store';

// interface, util
import totp from 'totp-generator';
import { useInterval, } from 'usehooks-ts';
import { GetOtpListRequest, GetOtpListResponse, Otp, OtpCode, OtpTrayMenuRequest, PasswordStatusType,
  PasswordModalState, } from '../../electron-src/interfaces';
import { BrowserStorage, } from '../utils';

const IndexPage = () => {

  const [otpCodeList, setOtpCodeList,] = useState<OtpCode[]>([]);
  const [otpList, setOtpList,] = useRecoilState<Otp[]>(otpListAtom);
  const setPasswordModalState = useSetRecoilState<PasswordModalState>(passwordModalStateAtom);
  const passwordStatusType = useRecoilValue<PasswordStatusType>(passwordStatusTypeAtom);
  const intervalTime: number = 500;

  useEffect(() => {
    const getOtpListHandler = (_event, response: GetOtpListResponse) => {
      setOtpList(response.otpList);
    };
    global.ipcRenderer.addListener('getOtpList', getOtpListHandler);

    const request: GetOtpListRequest = {
      password: BrowserStorage.getPassword(),
    };
    global.ipcRenderer.send('getOtpList', request);

    return () => {
      global.ipcRenderer.removeListener('getOtpList', getOtpListHandler);
    };
  }, []);

  useInterval(() => {
    const password: string = BrowserStorage.getPassword();
    if (password === '') { // 비밀 번호가 입력되지 않거나 유효 시간이 초과 한 경우
      setOtpList([]);
      setOtpCodeList([]);
      const request: OtpTrayMenuRequest = {
        password,
        otpCodeList: [],
      };
      global.ipcRenderer.send('setTrayMenu', request);
      setPasswordModalState({
        isOpen: true,
      });
    } else {
      const newOtpCodeList: OtpCode[] = otpList.map(item => getOTPCode(item, otpCodeList));
      setOtpCodeList(newOtpCodeList);
      const request: OtpTrayMenuRequest = {
        password,
        otpCodeList: newOtpCodeList,
      };
      global.ipcRenderer.send('setTrayMenu', request);
    }
  }, intervalTime);

  function getOTPCode (otp: Otp, otpCodeList: OtpCode[]): OtpCode {
    const now: Date = new Date();
    const time: number = now.getSeconds() * 1000 + now.getMilliseconds();

    const index: number = otpCodeList.findIndex(item => item.otp.id === otp.id);
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
      otp,
      code: code,
      progress: (time % 30000) / 30000 * 100,
    };
  }

  return (
    <Layout title='OTP Manager'>
      <VStack padding='.8rem'>
        {passwordStatusType === 'VALIDATE' && otpCodeList.length === 0 && <OtpEmpty/>}
        {otpCodeList.map((item, index) => (
          <Container key={index} padding='0'>
            <OtpItem otpCode={item}/>
          </Container>
        ))}
      </VStack>
    </Layout>
  );
};

export default IndexPage;
