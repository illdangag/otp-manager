// react, element
import styles from './index.module.scss';
import { ChangeEvent, useEffect, useState, } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, Text, Divider, Textarea, useToast,
} from '@chakra-ui/react';

// state management
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpListAtom, otpQrCodeCreateModalStateAtom, } from '../../../store';
import { CreateOtpRequest, CreateOtpResponse, OtpQrCodeCreateModalState, } from '../../../../electron-src/interfaces';

// interface, util
import { Otp, } from '../../../../electron-src/interfaces';
import { BrowserStorage, getOTPData, } from '../../../utils';
import QrScanner from 'qr-scanner';

const OtpQrCodeCreateModal = () => {

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

  const [invalidImage, setInvalidImage,] = useState<boolean>(false);

  const [otpQrCodeCreateModalState, setOtpQrCodeCreateModalState,] = useRecoilState<OtpQrCodeCreateModalState>(otpQrCodeCreateModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);
  const toast = useToast();

  useEffect(() => {
    const setOtpHandler = (_event, response: CreateOtpResponse) => {
      if (response.error === null) {
        setOtpQrCodeCreateModalState({
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

  const onClickCancelButton = () => {
    setOtpQrCodeCreateModalState({
      isOpen: false,
    });
    clear();
    setInvalidImage(false);
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

  const onClickSaveButton = () => {
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

  const onChangeQrCodeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file: File = event.target.files.item(0);
      try {
        const result: string = await QrScanner.scanImage(file);
        const otp: Otp = getOTPData(result);
        setUser(otp.user);
        setSecret(otp.secret);
        setIssuer(otp.issuer);
        setDisabledEditIssuer(false);
        setDisabledEditUser(false);
        setDisabledDescription(false);
        setDisabledSaveButton(false);
        setInvalidImage(false);
      } catch (error) {
        setInvalidImage(true);
        clear();
      }
    } else {
      setInvalidImage(false);
    }
  };

  function clear () {
    setSecret('');
    setIssuer('');
    setUser('');
    setIssuerDescription('');
    setUserDescription('');
    setDescription('');
    setDisabledEditIssuer(true);
    setDisabledEditUser(true);
    setDisabledDescription(true);
    setDisabledSaveButton(true);
  }

  return (
    <Modal isOpen={otpQrCodeCreateModalState.isOpen} onClose={() => {}} size='full' scrollBehavior='inside'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent className={styles.root}>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody paddingBottom='1rem'>
          <Text fontWeight={600}>OTP QR Code</Text>
          <Input
            className={styles.qrcodeInputFile}
            padding='.4rem'
            type='file'
            onChange={onChangeQrCodeFile}
          />
          {invalidImage ? <Text fontSize='sm' color='red.500'>이미지가 올바르지 않습니다.</Text> : <Text fontSize='sm'>QR code 이미지를 선택하세요</Text>}
          <Divider marginTop='.8rem' marginBottom='.8rem'/>
          <Text fontSize='sm' fontWeight={600}>Issuer</Text>
          <Input
            marginTop='.2rem'
            placeholder={issuer}
            value={issuerDescription}
            disabled={disabledEditIssuer}
            onChange={onChangeIssuerDescription}
            tabIndex={2}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>User</Text>
          <Input
            marginTop='.2rem'
            placeholder={user}
            value={userDescription}
            disabled={disabledEditUser}
            onChange={onChangeUserDescription}
            tabIndex={3}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>설명</Text>
          <Textarea
            placeholder='간단한 설명을 입력해주세요'
            disabled={disabledDescription}
            value={description}
            onChange={onChangeDescription}
            tabIndex={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClickCancelButton}>취소</Button>
          <Button colorScheme='blue' disabled={disabledSaveButton} onClick={onClickSaveButton} tabIndex={4}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpQrCodeCreateModal;

