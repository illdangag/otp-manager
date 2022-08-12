import { useEffect, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Text, Box, Divider, useToast, } from '@chakra-ui/react';
import { Otp, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';

interface Props {
  isOpen?: boolean,
  onClose?: () => void,
  otp: Otp,
}

const OtpDeleteModal = ({
  isOpen = false,
  onClose = () => {},
  otp,
}: Props) => {

  const toast = useToast();

  useEffect(() => {
    const deleteOtpHandler = (_event, args: any) => {
      const error: string | null = args.error;
      if (error === null) {
        toast({
          title: 'OTP 삭제',
          position: 'top',
          duration: 2000,
        });
        onClose();
        global.ipcRenderer.send('getOtpList', {
          password: BrowserStorage.getPassword(),
        });
      }
    };
    global.ipcRenderer.addListener('deleteOtp', deleteOtpHandler);
  }, []);

  const onClickDeleteButton = () => {
    global.ipcRenderer.send('deleteOtp', {
      password: BrowserStorage.getPassword(),
      id: otp.id,
    });
  };

  const onClickCloseButton = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 삭제</ModalHeader>
        <ModalBody paddingBottom='2rem'>
          <Box borderWidth='1px' borderRadius='.6rem' padding='.6rem'>
            <Text fontSize='sm'>Issuer</Text>
            <Text fontSize='xl'>{otp.issuer}</Text>
            {otp.issuerDescription && <Text fontSize='md'>{otp.issuerDescription}</Text>}
            <Divider marginTop='.8rem' marginBottom='.8rem'/>
            <Text fontSize='sm'>User</Text>
            <Text fontSize='xl'>{otp.user}</Text>
            {otp.userDescription && <Text fontSize='md'>{otp.userDescription}</Text>}
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
