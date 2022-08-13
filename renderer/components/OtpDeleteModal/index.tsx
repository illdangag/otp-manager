import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Text, Box, Divider, useToast, } from '@chakra-ui/react';
import { DeleteOtpRequest, DeleteOtpResponse, Otp, OtpDeleteModalState, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { otpDeleteModalStateAtom, otpListAtom, } from '../../store';

const OtpDeleteModal = () => {

  const [otp, setOtp,] = useState<Otp | null>(null);
  const [otpDeleteModalState, setOtpDeleteModalState,] = useRecoilState<OtpDeleteModalState>(otpDeleteModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);

  const toast = useToast();

  useEffect(() => {
    const deleteOtpHandler = (_event, response: DeleteOtpResponse) => {
      if (response.error === null) {
        toast({
          title: 'OTP 삭제',
          position: 'top',
          duration: 2000,
        });
        setOtpDeleteModalState({
          isOpen: false,
          otp: null,
        });
        setOtpList(response.otpList);
      }
    };
    global.ipcRenderer.addListener('deleteOtp', deleteOtpHandler);
  }, []);

  useEffect(() => {
    setOtp(otpDeleteModalState.otp);
  }, [otpDeleteModalState,]);


  const onClickDeleteButton = () => {
    const request: DeleteOtpRequest = {
      password: BrowserStorage.getPassword(),
      id: otp.id,
    };
    global.ipcRenderer.send('deleteOtp', request);
  };

  const onClickCloseButton = () => {
    setOtpDeleteModalState({
      isOpen: false,
      otp: null,
    });
  };

  return (
    <Modal isOpen={otpDeleteModalState.isOpen} onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 삭제</ModalHeader>
        <ModalBody paddingBottom='2rem'>
          <Box borderWidth='1px' borderRadius='.6rem' padding='.6rem'>
            <Text fontSize='sm'>Issuer</Text>
            <Text fontSize='xl'>{otp !== null ? otp.issuer : ''}</Text>
            {otp !== null && otp.issuerDescription && <Text fontSize='md'>{otp.issuerDescription}</Text>}
            <Divider marginTop='.8rem' marginBottom='.8rem'/>
            <Text fontSize='sm'>User</Text>
            <Text fontSize='xl'>{otp !== null ? otp.user : ''}</Text>
            {otp !== null && otp.userDescription && <Text fontSize='md'>{otp.userDescription}</Text>}
          </Box>
          <Text marginTop='1rem'>삭제 하시겠습니까?</Text>
        </ModalBody>
        <ModalFooter>
          <Button marginRight='1rem' onClick={onClickCloseButton}>취소</Button>
          <Button colorScheme='red' onClick={onClickDeleteButton}>삭제</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpDeleteModal;
