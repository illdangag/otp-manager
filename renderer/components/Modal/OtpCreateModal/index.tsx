import { useEffect, useState, } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text, useToast, Divider, Textarea,
} from '@chakra-ui/react';

import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpCreateModalStateAtom, otpListAtom, } from '../../../store';

import { CreateOtpRequest, CreateOtpResponse, Otp, OtpCreateModalState, } from '../../../../electron-src/interfaces';
import { BrowserStorage, } from '../../../utils';

const OtpCreateModal = () => {

  const [url, setUrl,] = useState<string>('');
  const [issuer, setIssuer,] = useState<string>('');
  const [user, setUser,] = useState<string>('');
  const [secret, setSecret,] = useState<string>('');

  const [issuerDescription, setIssuerDescription,] = useState<string>('');
  const [userDescription, setUserDescription,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  const [disabledEditIssuer, setDisabledEditIssuer,] = useState<boolean>(true);
  const [disabledEditUser, setDisabledEditUser,] = useState<boolean>(true);
  const [disabledDescription, setDisabledDescription,] = useState<boolean>(true);
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
    setDisabledDescription(false);
    setDisabledSaveButton(false);
  };

  const onChangeUserDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDescription(event.target.value);
  };

  const onChangeIssuerDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIssuerDescription(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onClickSave = () => {
    const otp: Otp = {
      issuer, user, secret, issuerDescription, userDescription, description,
    };
    const request: CreateOtpRequest = {
      password: BrowserStorage.getPassword(), otp,
    };
    global.ipcRenderer.send('createOtp', request);

    toast({
      title: 'OTP 추가', position: 'top', duration: 2000,
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
    setSecret('');
    setIssuer('');
    setUser('');
    setIssuerDescription('')
    setUserDescription('');
    setDescription('');
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledDescription(true);
    setDisabledSaveButton(true);
  }

  return (
    <Modal isOpen={otpCreateModalState.isOpen} size='sm' onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody pb={6}>
          <Text fontWeight={600}>OTP URL</Text>
          <Input
            size='md'
            placeholder='OPT URL'
            value={url}
            onChange={onChangeUrl}
          />
          <Text fontSize='sm' color='gray.600'>QR code URL을 복사하여 붙여넣으세요</Text>
          <Divider marginTop='.8rem' marginBottom='.8rem' borderColor='gray.300'/>
          <Text fontSize='sm' fontWeight={600}>Issuer</Text>
          <Input
            marginTop='.2rem'
            placeholder={issuer}
            value={issuerDescription}
            disabled={disabledEditIssuer}
            onChange={onChangeIssuerDescription}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>User</Text>
          <Input
            marginTop='.2rem'
            placeholder={user}
            value={userDescription}
            disabled={disabledEditUser}
            onChange={onChangeUserDescription}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>설명</Text>
          <Textarea
            placeholder='간단한 설명을 입력해주세요'
            disabled={disabledDescription}
            value={description}
            onChange={onChangeDescription}
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
