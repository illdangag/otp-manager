import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, Input, Text, } from '@chakra-ui/react';
import { BrowserStorage, } from '../../utils';
import { Otp, OtpUpdateModalState, UpdateOtpResponse, } from '../../../electron-src/interfaces';
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpUpdateModalStateAtom, otpListAtom, } from '../../store';

const OtpUpdateModal = () => {

  const [otpUpdateModalState, setOtpUpdateModalState,] = useRecoilState<OtpUpdateModalState>(otpUpdateModalStateAtom);

  const [otp, setOtp,] = useState<Otp | null>(null);
  const [issuerDescription, setIssuerDescription,] = useState<string>('');
  const [userDescription, setUserDescription,] = useState<string>('');

  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);

  useEffect(() => {
    const updateOtpHandler = (_event, response: UpdateOtpResponse) => {
      if (response.error === null) {
        setOtpUpdateModalState({
          isOpen: false,
          otp: null,
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
    }
  }, [otpUpdateModalState,]);


  const onChangeIssuer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIssuer: string = event.target.value;
    setIssuerDescription(newIssuer);
  };

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUser: string = event.target.value;
    setUserDescription(newUser);
  };

  const onClickCancelButton = () => {
    setOtpUpdateModalState({
      isOpen: false,
      otp: null,
    });
  };

  const onClickSaveButton = () => {
    global.ipcRenderer.send('updateOtp', {
      password: BrowserStorage.getPassword(),
      otp: {
        id: otp.id,
        issuerDescription,
        userDescription,
      } as Otp,
    });
  };

  return (
    <Modal isOpen={otpUpdateModalState.isOpen} size='sm' onClose={() => {}} >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 수정</ModalHeader>
        <ModalBody pb={6}>
          <Text>Issuer</Text>
          <Input
            marginTop='0.2rem'
            placeholder={otp !== null ? otp.issuer : ''}
            value={issuerDescription}
            onChange={onChangeIssuer}
          />
          <Text marginTop='1rem'>User</Text>
          <Input
            marginTop='0.2rem'
            placeholder={otp !== null ? otp.user : ''}
            value={userDescription}
            onChange={onChangeUser}
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
