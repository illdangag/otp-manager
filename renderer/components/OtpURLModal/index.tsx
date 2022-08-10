import styles from './index.module.scss';
import { useEffect, } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Text, InputGroup, InputRightElement,
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

  const [url, setUrl,] = useState('');
  const [user, setUser,] = useState('');
  const [secret, setSecret,] = useState('');
  const [issuer, setIssuer,] = useState('');
  const [disabledEditIssuer, setDisabledEditIssuer,] = useState(true);
  const [disabledEditUser, setDisabledEditUser,] = useState(true);
  const [disabledEditIssuerButton, setDisabledEditIssuerButton,] = useState(true);
  const [disabledEditUserButton, setDisabledEditUserButton,] = useState(true);
  const [disabledSaveButton, setDisabledSaveButton,] = useState(true);

  useEffect(() => {
    const setOtpHandler = (_event, args) => {
      if (args.result) {
        global.ipcRenderer.send('getOtps', {
          password: BrowserStorage.getPassword(),
        });
        onClose();
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

  const clear = () => {
    setUser('');
    setSecret('');
    setIssuer('');
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledEditIssuerButton(true);
    setDisabledEditUserButton(true);
    setDisabledSaveButton(true);
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody pb={6}>
          <Text>OTP URL</Text>
          <Input placeholder='OPT URL' value={url} onChange={onChangeUrl}/>
          <div className={styles.edit}>
            <Text>Issuer</Text>
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClose}>취소</Button>
          <Button colorScheme='blue' disabled={disabledSaveButton} onClick={onClickSave}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpURLModal;
