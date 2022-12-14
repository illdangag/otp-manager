// react, element
import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text, useToast, Divider,
  Textarea, } from '@chakra-ui/react';

// state management
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpURLCreateModalStateAtom, otpListAtom, } from '../../../store';

// interface, util
import { CreateOtpRequest, CreateOtpResponse, Otp, OtpURLCreateModalState, } from '../../../../electron-src/interfaces';
import { BrowserStorage, getOTPData, } from '../../../utils';

const OtpURLCreateModal = () => {

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

  const [otpURLCreateModalState, setOtpURLCreateModalState,] = useRecoilState<OtpURLCreateModalState>(otpURLCreateModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);
  const toast = useToast();

  useEffect(() => {
    const setOtpHandler = (_event, response: CreateOtpResponse) => {
      if (response.error === null) {
        setOtpURLCreateModalState({
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

    try {
      const otp: Otp = getOTPData(decodedValue);
      setUser(otp.user);
      setSecret(otp.secret);
      setIssuer(otp.issuer);
      setDisabledEditIssuer(false);
      setDisabledEditUser(false);
      setDisabledDescription(false);
      setDisabledSaveButton(false);
    } catch {
      clear();
    }
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
      title: 'OTP ??????', position: 'top', duration: 2000,
    });
  };

  const onClickCancel = () => {
    setOtpURLCreateModalState({
      isOpen: false,
    });
    clear();
  };

  function clear () {
    setUrl('');
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
    <Modal isOpen={otpURLCreateModalState.isOpen} size='full' scrollBehavior='inside' onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP ??????</ModalHeader>
        <ModalBody paddingBottom='1rem'>
          <Text fontWeight={600}>OTP URL</Text>
          <Input
            size='md'
            placeholder='OPT URL'
            value={url}
            onChange={onChangeUrl}
            tabIndex={1}
          />
          <Text fontSize='sm'>QR code URL??? ???????????? ??????????????????</Text>
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
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>??????</Text>
          <Textarea
            placeholder='????????? ????????? ??????????????????'
            disabled={disabledDescription}
            value={description}
            onChange={onChangeDescription}
            tabIndex={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClickCancel}>??????</Button>
          <Button colorScheme='blue' disabled={disabledSaveButton} onClick={onClickSaveButton} tabIndex={4}>??????</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpURLCreateModal;
