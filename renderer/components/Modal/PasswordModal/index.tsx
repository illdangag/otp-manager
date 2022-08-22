// react, element
import { useEffect, useState, } from 'react';
import { Button, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
  useToast, VStack, } from '@chakra-ui/react';

// state management
import { useRecoilState, useSetRecoilState, } from 'recoil';
import { passwordModalStateAtom, passwordResetModalStateAtom, otpListAtom, } from '../../../store';

// interface, util
import { Otp, PasswordModalState, PasswordResetModalState, PasswordStatusType, ValidatePasswordRequest,
  ValidatePasswordResponse, } from '../../../../electron-src/interfaces';
import { BrowserStorage, } from '../../../utils';

const PasswordModal = () => {
  const [password, setPassword,] = useState<string>('');
  const [isShowPassword, setShowPassword,] = useState<boolean>(false);
  const [incorrectPassword, setIncorrectPassword,] = useState<boolean>(false);
  const [attemptPassword, setAttemptPassword,] = useState<boolean>(false);

  const [passwordModalState, setPasswordModalState,] = useRecoilState<PasswordModalState>(passwordModalStateAtom);
  const setPasswordResetModalState = useSetRecoilState<PasswordResetModalState>(passwordResetModalStateAtom);
  const setOptList = useSetRecoilState<Otp[]>(otpListAtom);

  const toast = useToast();

  useEffect(() => {
    const validatePasswordHandler = (_event, response: ValidatePasswordResponse) => {
      const passwordStatusType: PasswordStatusType = response.type;
      if (passwordStatusType === 'VALIDATE') {
        setPasswordModalState({
          isOpen: false,
        });
        setOptList(response.otpList);
        clear();
      } else {
        setIncorrectPassword(true);
        if (passwordStatusType === 'INVALIDATE') {
          toast({
            title: '로그인 실패', status: 'error', duration: 2000, position: 'top',
          });
        }
      }
    };

    global.ipcRenderer.addListener('validatePassword', validatePasswordHandler);

    return () => {
      global.ipcRenderer.removeListener('validatePassword', validatePasswordHandler);
    };
  }, []);

  const onClickShowPasswordButton = () => {
    setShowPassword(!isShowPassword);
  };

  const onChangePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onKeyUpPasswordInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      validatePassword();
    }
  };

  const onClickSaveButton = () => {
    validatePassword();
  };

  const onClickResetPasswordButton = () => {
    setPasswordResetModalState({
      isOpen: true,
    });
  };

  const clear = () => {
    setPassword('');
    setShowPassword(false);
    setIncorrectPassword(false);
    setAttemptPassword(false);
  };

  const validatePassword = () => {
    setAttemptPassword(true);
    BrowserStorage.setPassword(password);

    global.ipcRenderer.send('validatePassword', {
      password,
    } as ValidatePasswordRequest);
  };

  return (
    <>
      <Modal isOpen={passwordModalState.isOpen} size='sm' onClose={() => {}}>
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
                  onChange={onChangePasswordInput}
                  onKeyUp={onKeyUpPasswordInput}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    height='1.75rem'
                    size='sm'
                    onClick={onClickShowPasswordButton}
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
              onClick={onClickResetPasswordButton}
            >
              비밀번호 초기화
            </Button>
            <Button
              colorScheme='blue'
              disabled={password.length === 0}
              onClick={onClickSaveButton}
            >
              로그인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PasswordModal;
