import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Text, useToast, } from '@chakra-ui/react';
import { CreateOtpRequest, CreateOtpResponse, Otp, OtpCreateModalState, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpCreateModalStateAtom, otpListAtom, } from '../../store';

const OtpCreateModal = () => {

  const [url, setUrl,] = useState<string>('');
  const [issuer, setIssuer,] = useState<string>('');
  const [user, setUser,] = useState<string>('');
  const [secret, setSecret,] = useState<string>('');

  const [issuerDescription, setIssuerDescription,] = useState<string>('');
  const [userDescription, setUserDescription,] = useState<string>('');

  const [disabledEditIssuer, setDisabledEditIssuer,] = useState<boolean>(true);
  const [disabledEditUser, setDisabledEditUser,] = useState<boolean>(true);
  const [disabledSaveButton, setDisabledSaveButton,] = useState<boolean>(true);

  const [otpCreateModalState, setOtpCreateModalState,] = useRecoilState<OtpCreateModalState>(otpCreateModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);
  const toast = useToast();

  useEffect(() => {
    const setOtpHandler = (_event, response: CreateOtpResponse) => {
      if (response.error === null) {
        setOtpCreateModalState({
          isOpen: false,
        });
        setOtpList(response.otpList);
        clear();
      }
    };
    global.ipcRenderer.addListener('createOtp', setOtpHandler);

    return () => {
      global.ipcRenderer.removeListener('createOtp', setOtpHandler);
    };
  }, []);

  const onChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue: string = event.target.value;
    setUrl(targetValue);
    const decodedValue: string = decodeURIComponent(targetValue);
    if (decodedValue.indexOf('otpauth://totp/') === -1) {
      clear();
      return;
    }

    let user: string = '';
    let secret: string = '';
    let issuer: string = '';

    const otpAuthData: String[] = decodedValue.split('otpauth://totp/');
    if (otpAuthData.length !== 2) {
      clear();
      return;
    }
    user = otpAuthData[1].split('?')[0];

    const queryString: string = otpAuthData[1].split('?')[1];
    const keyValueList: string[] = queryString.split('&');
    for (const keyValue of keyValueList) {
      const data: string[] = keyValue.split('=');
      const key: string = data[0];
      const value: string = data[1];
      if (key.toLocaleLowerCase() === 'secret') {
        secret = value;
      } else if (key.toLocaleLowerCase() === 'issuer') {
        issuer = value;
      }
    }

    if (user === '' || secret === '' || issuer === '') {
      clear();
      return;
    }

    setUser(user);
    setSecret(secret);
    setIssuer(issuer);
    setDisabledEditIssuer(false);
    setDisabledEditUser(false);
    setDisabledSaveButton(false);
  };

  const onChangeUserDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setUserDescription(value);
  };

  const onChangeIssuerDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setIssuerDescription(value);
  };

  const onClickSave = () => {
    const otp: Otp = {
      issuer,
      user,
      secret,
      issuerDescription,
      userDescription,
    };
    const request: CreateOtpRequest = {
      password: BrowserStorage.getPassword(),
      otp,
    };
    global.ipcRenderer.send('createOtp', request);

    toast({
      title: 'OTP 추가',
      position: 'top',
      duration: 2000,
    });
  };

  const onClickCancel = () => {
    setOtpCreateModalState({
      isOpen: false,
    });
    clear();
  };

  function clear () {
    setUrl('');
    setUser('');
    setSecret('');
    setIssuer('');
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledSaveButton(true);
  }

  return (
    <Modal isOpen={otpCreateModalState.isOpen} onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody pb={6}>
          <Text>OTP URL</Text>
          <Input
            placeholder='OPT URL'
            value={url}
            onChange={onChangeUrl}
          />
          <Text marginTop='1rem'>Issuer</Text>
          <Input
            marginTop='0.2rem'
            placeholder={issuer}
            value={issuerDescription}
            disabled={disabledEditIssuer}
            onChange={onChangeIssuerDescription}
          />
          <Text marginTop='0.4rem'>User</Text>
          <Input
            marginTop='0.2rem'
            placeholder={user}
            value={userDescription}
            disabled={disabledEditUser}
            onChange={onChangeUserDescription}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClickCancel}>취소</Button>
          <Button colorScheme='blue' disabled={disabledSaveButton} onClick={onClickSave}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpCreateModal;
