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
        <ModalHeader>???????????? ?????????</ModalHeader>
        <ModalBody pb={6}>
          <Text fontSize='md'>??????????????? ????????? ?????? ?????? ????????? ?????? OTP ???????????? ?????? ?????????.</Text>
          <Text marginTop='1rem' fontSize='md'>????????? ????????? ???????????????????</Text>
        </ModalBody>
        <ModalFooter>
          <Button marginRight='1rem' onClick={onClickCancelButton}>??????</Button>
          <Button colorScheme='red' onClick={onClickReset}>?????????</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordResetModal;
