import { useEffect, useState, } from 'react';
import { Button, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Text, useToast, VStack, } from '@chakra-ui/react';
import { PasswordStatus, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';
import ResetPasswordModal from '../ResetPasswordModal';

interface Props {
  isOpen?: boolean,
  onClose?: (isResetPassword: boolean) => void,
}

const PasswordModal = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {

  const [password, setPassword,] = useState<string>('');
  const [isShowPassword, setShowPassword,] = useState<boolean>(false);
  const [incorrectPassword, setIncorrectPassword,] = useState<boolean>(false);
  const [attemptPassword, setAttemptPassword,] = useState<boolean>(false);
  const [isShowResetPasswordModal, setShowResetPasswordModal,] = useState<boolean>(false);

  const toast = useToast();

  useEffect(() => {
    const getSettingHandler = (_event, args) => {
      const passwordStatus: PasswordStatus = args as PasswordStatus;
      if (passwordStatus.type === 'VALIDATE') {
        onClose(false);
        showSuccessToast();
        clear();
      } else {
        setIncorrectPassword(true);
      }
    };

    global.ipcRenderer.addListener('getSetting', getSettingHandler);

    return () => {
      global.ipcRenderer.removeListener('getSetting', getSettingHandler);
    };
  }, []);

  const onClickShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    BrowserStorage.setPassword(event.target.value);
  };

  const onClickSave = () => {
    setAttemptPassword(true);
    global.ipcRenderer.send('getSetting', {
      password,
    });
  };

  const onClickResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const onCloseResetPassword = (isResetPassword: boolean) => {
    if (isResetPassword) {
      onClose(true);
      clear();
    }
    setShowResetPasswordModal(false);
  };

  function showSuccessToast () {
    toast({
      title: '로그인 성공',
      status: 'success',
      duration: 2500,
      position: 'top',
    });
  }

  function clear () {
    setPassword('');
    setShowPassword(false);
    setIncorrectPassword(false);
    setAttemptPassword(false);
    setShowResetPasswordModal(false);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
        <ModalContent>
          <ModalHeader>비밀번호 입력</ModalHeader>
          <ModalBody pb={6}>
            <VStack spacing={2}>
              <InputGroup size='md'>
                <Input
                  paddingRight='4.5rem'
                  type={isShowPassword ? 'text' : 'password'}
                  placeholder='비밀번호'
                  value={password}
                  borderColor={attemptPassword && incorrectPassword ? 'red.200' : 'gray.200'}
                  focusBorderColor={attemptPassword && incorrectPassword ? 'red.200' : 'blue.500'}
                  onChange={onChangePassword}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    height='1.75rem'
                    size='sm'
                    onClick={onClickShowPassword}
                  >
                    {isShowPassword ? '가리기' : '보이기'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </VStack>
            <Text marginTop='1rem' fontSize='small' color='gray.600'>로그인 유지 시간은 12시간 입니다.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              marginRight='auto'
              colorScheme='red'
              variant='ghost'
              onClick={onClickResetPassword}
            >
              비밀번호 초기화
            </Button>
            <Button
              colorScheme='blue'
              disabled={password.length === 0}
              onClick={onClickSave}
            >
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ResetPasswordModal isOpen={isShowResetPasswordModal} onClose={onCloseResetPassword}/>
    </>
  );
};

export default PasswordModal;
