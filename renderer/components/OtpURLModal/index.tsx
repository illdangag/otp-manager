import { useEffect, } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Text, InputGroup, InputRightElement, useToast,
} from '@chakra-ui/react';
import { useState, } from 'react';
import { Otp, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';

interface Props {
  isOpen?: boolean,
  onClose?: () => void,
}

const OtpURLModal = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {

  const [url, setUrl,] = useState<string>('');
  const [user, setUser,] = useState<string>('');
  const [secret, setSecret,] = useState<string>('');
  const [issuer, setIssuer,] = useState<string>('');
  const [disabledEditIssuer, setDisabledEditIssuer,] = useState<boolean>(true);
  const [disabledEditUser, setDisabledEditUser,] = useState<boolean>(true);
  const [disabledEditIssuerButton, setDisabledEditIssuerButton,] = useState<boolean>(true);
  const [disabledEditUserButton, setDisabledEditUserButton,] = useState<boolean>(true);
  const [disabledSaveButton, setDisabledSaveButton,] = useState<boolean>(true);

  const toast = useToast();

  useEffect(() => {
    const setOtpHandler = (_event, args) => {
      if (args.result) {
        global.ipcRenderer.send('getOtpList', {
          password: BrowserStorage.getPassword(),
        });
        onClose();
        clear();
      }
    };
    global.ipcRenderer.addListener('setOtp', setOtpHandler);

    return () => {
      global.ipcRenderer.removeListener('setOtp', setOtpHandler);
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
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledEditIssuerButton(false);
    setDisabledEditUserButton(false);
    setDisabledSaveButton(false);
  };

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setUser(value);
  };

  const onChangeIssuer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setIssuer(value);
  };

  const onClickEditIssuer = () => {
    setDisabledEditIssuer(false);
  };

  const onClickEditUser = () => {
    setDisabledEditUser(false);
  };

  const onClickSave = () => {
    const otp: Otp = {
      user,
      secret,
      issuer,
    };
    global.ipcRenderer.send('setOtp', {
      otp: otp,
      password: BrowserStorage.getPassword(),
    });
    showAddOTPToast();
  };

  const onClickCancel = () => {
    onClose();
    clear();
  };

  function clear () {
    setUrl('');
    setUser('');
    setSecret('');
    setIssuer('');
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledEditIssuerButton(true);
    setDisabledEditUserButton(true);
    setDisabledSaveButton(true);
  }

  function showAddOTPToast () {
    toast({
      title: `OTP 추가`,
      position: 'top',
      duration: 2000,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody pb={6}>
          <Text>OTP URL</Text>
          <Input placeholder='OPT URL' value={url} onChange={onChangeUrl}/>
          <Text marginTop='1rem'>Issuer</Text>
          <InputGroup size='md'>
            <Input paddingRight='4.5rem' placeholder='Issuer' value={issuer} disabled={disabledEditIssuer} onChange={onChangeIssuer}/>
            <InputRightElement width='4.5rem'>
              <Button height='1.75rem' disabled={disabledEditIssuerButton} onClick={onClickEditIssuer}>수정</Button>
            </InputRightElement>
          </InputGroup>
          <Text>User</Text>
          <InputGroup>
            <Input paddingRight='4.5rem' placeholder='Host' value={user} disabled={disabledEditUser} onChange={onChangeUser}/>
            <InputRightElement width='4.5rem'>
              <Button height='1.75rem' disabled={disabledEditUserButton} onClick={onClickEditUser}>수정</Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClickCancel}>취소</Button>
          <Button colorScheme='blue' disabled={disabledSaveButton} onClick={onClickSave}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpURLModal;
