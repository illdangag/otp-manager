// react, element
import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text, Textarea, } from '@chakra-ui/react';

// state management
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpUpdateModalStateAtom, otpListAtom, } from '../../../store';

// interface, util
import { BrowserStorage, } from '../../../utils';
import { Otp, OtpUpdateModalState, UpdateOtpRequest, UpdateOtpResponse, } from '../../../../electron-src/interfaces';

const OtpUpdateModal = () => {

  const [otpUpdateModalState, setOtpUpdateModalState,] = useRecoilState<OtpUpdateModalState>(otpUpdateModalStateAtom);

  const [otp, setOtp,] = useState<Otp | null>(null);
  const [issuerDescription, setIssuerDescription,] = useState<string>('');
  const [userDescription, setUserDescription,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);

  useEffect(() => {
    const updateOtpHandler = (_event, response: UpdateOtpResponse) => {
      if (response.error === null) {
        setOtpUpdateModalState({
          isOpen: false, otp: null,
        });
        setOtpList(response.otpList);
      }
    };
    global.ipcRenderer.addListener('updateOtp', updateOtpHandler);

    return () => {
      global.ipcRenderer.removeListener('updateOtp', updateOtpHandler);
    };
  }, []);

  useEffect(() => {
    if (otpUpdateModalState.otp) {
      const otp: Otp = otpUpdateModalState.otp;
      setOtp(otp);
      setIssuerDescription(otp.issuerDescription);
      setUserDescription(otp.userDescription);
      setDescription(otp.description);
    }
  }, [otpUpdateModalState,]);


  const onChangeIssuer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIssuerDescription(event.target.value);
  };

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDescription(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onClickCancelButton = () => {
    setOtpUpdateModalState({
      isOpen: false, otp: null,
    });
  };

  const onClickSaveButton = () => {
    const updateOtp: Otp = {
      ...otp,
      issuerDescription,
      userDescription,
      description,
    };
    const request: UpdateOtpRequest = {
      password: BrowserStorage.getPassword(),
      otp: updateOtp,
    };
    global.ipcRenderer.send('updateOtp', request);
  };

  return (
    <Modal isOpen={otpUpdateModalState.isOpen} size='full' scrollBehavior='inside' onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 수정</ModalHeader>
        <ModalBody pb={6}>
          <Text fontSize='sm' fontWeight={600}>Issuer</Text>
          <Input
            marginTop='.2rem'
            placeholder={otp !== null ? otp.issuer : ''}
            value={issuerDescription}
            onChange={onChangeIssuer}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>User</Text>
          <Input
            marginTop='.2rem'
            placeholder={otp !== null ? otp.user : ''}
            value={userDescription}
            onChange={onChangeUser}
          />
          <Text marginTop='.4rem' fontSize='sm' fontWeight={600}>설명</Text>
          <Textarea
            placeholder='간단한 설명을 입력해주세요'
            value={description}
            onChange={onChangeDescription}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight='1rem' onClick={onClickCancelButton}>취소</Button>
          <Button colorScheme='blue' disabled={otpUpdateModalState.otp === null} onClick={onClickSaveButton}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpUpdateModal;
