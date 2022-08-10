import {
  Button, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Text, VStack
} from '@chakra-ui/react';
import { BrowserStorage } from '../../utils';

interface Props {
  isOpen?: boolean,
  onClose?: (isResetPassword: boolean) => void,
}

const ResetPasswordModal = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {

  const onClickReset = () => {
    global.ipcRenderer.send('clear', {});
    BrowserStorage.clear();
    onClose(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} >
      <ModalOverlay
        bg='none'
        backdropFilter='auto'
        backdropInvert='80%'
        backdropBlur='2px'
      />
      <ModalContent>
        <ModalHeader>비밀번호 초기화</ModalHeader>
        <ModalBody pb={6}>
          <Text fontSize='medium' color='gray.600'>비밀번호를 초기화 하는 경우 등록해 놓은 OTP 데이터는 삭제 됩니다.</Text>
          <Text marginTop='1rem' fontSize='medium' color='gray.600'>그래도 초기화 하시겠습니까?</Text>
        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={() => onClose(false)}>취소</Button>
          <Button colorScheme='red' onClick={onClickReset}>초기화</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordModal;
