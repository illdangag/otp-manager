// react, element
import {} from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, } from '@chakra-ui/react';

// state management
import { useRecoilState, } from 'recoil';
import { otpQrCodeCreateModalStateAtom, } from '../../../store';
import { OtpQrCodeCreateModalState } from '../../../../electron-src/interfaces';

// interface, util

const OtpQrCodeCreateModal = () => {

  const [otpQrCodeCreateModalState, setOtpQrCodeCreateModalState,] = useRecoilState<OtpQrCodeCreateModalState>(otpQrCodeCreateModalStateAtom);

  const onClickCancelButton = () => {
    setOtpQrCodeCreateModalState({
      isOpen: false,
    });
  };

  const onClickSaveButton = () => {

  };

  return (
    <Modal isOpen={otpQrCodeCreateModalState.isOpen} onClose={() => {}} size='full' scrollBehavior='inside'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 추가</ModalHeader>
        <ModalBody paddingBottom='1rem'>

        </ModalBody>
        <ModalFooter>
          <Button marginRight={3} onClick={onClickCancelButton}>취소</Button>
          <Button colorScheme='blue' disabled={true} onClick={onClickSaveButton} tabIndex={4}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpQrCodeCreateModal;

