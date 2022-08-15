// react, element
import { useEffect, } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Text, } from '@chakra-ui/react';

// state management
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { passwordResetModalStateAtom, passwordModalStateAtom, passwordSetModalStateAtom, otpListAtom, } from '../../../store';

// interface, util
import { ClearRequest, ClearResponse, PasswordModalState, PasswordResetModalState, PasswordSetModalState,
  Otp, } from '../../../../electron-src/interfaces';
import { BrowserStorage, } from '../../../utils';

const PasswordResetModal = () => {

  const [passwordResetModalState, setPasswordResetModalState,] = useRecoilState<PasswordResetModalState>(passwordResetModalStateAtom);
  const setPasswordModalState = useSetRecoilState<PasswordModalState>(passwordModalStateAtom);
  const setPasswordSetModalState = useSetRecoilState<PasswordSetModalState>(passwordSetModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);

  useEffect(() => {
    const clearHandler = (_event, response: ClearResponse) => {
      if (response.error === null) {
        BrowserStorage.clear();
        setOtpList([]);
        setPasswordResetModalState({
          isOpen: false,
        });
        setPasswordModalState({
          isOpen: false,
        });
        setPasswordSetModalState({
          isOpen: true,
        });
      }
    };
    global.ipcRenderer.addListener('clear', clearHandler);

    return () => {
      global.ipcRenderer.removeListener('clear', clearHandler);
    };
  }, []);

  const onClickReset = () => {
    global.ipcRenderer.send('clear', {} as ClearRequest);
  };

  const onClickCancelButton = () => {
    setPasswordResetModalState({
      isOpen: false,
    });
  };

  return (
    <Modal isOpen={passwordResetModalState.isOpen} size='sm' onClose={() => {}}>
      <ModalOverlay
        bg='none'
        backdropFilter='auto'
        backdropInvert='80%'
      />
      <ModalContent>
        <ModalHeader>비밀번호 초기화</ModalHeader>
        <ModalBody pb={6}>
          <Text fontSize='md'>비밀번호를 초기화 하는 경우 등록해 놓은 OTP 데이터는 삭제 됩니다.</Text>
          <Text marginTop='1rem' fontSize='md'>그래도 초기화 하시겠습니까?</Text>
        </ModalBody>
        <ModalFooter>
          <Button marginRight='1rem' onClick={onClickCancelButton}>취소</Button>
          <Button colorScheme='red' onClick={onClickReset}>초기화</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordResetModal;
