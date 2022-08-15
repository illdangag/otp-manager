// react, element
import { useEffect, useState, useRef, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputRightElement, VStack,
  Text, } from '@chakra-ui/react';

// state management
import { useSetRecoilState, useRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, passwordSetModalStateAtom, } from '../../../store';

// interface, util
import { BrowserStorage, } from '../../../utils';
import { MainPasswordResponse, PasswordSetModalState, PasswordStatusType, } from '../../../../electron-src/interfaces';

const PasswordSetModal = () => {

  const [isShowPassword, setShowPassword,] = useState(false);
  const [isShowValidate, setShowValidate,] = useState(false);
  const [password, setPassword,] = useState('');
  const [validate, setValidate,] = useState('');
  const [disabledSaveButton, setDisabledSaveButton,] = useState(true);

  const setPasswordStatusType = useSetRecoilState<PasswordStatusType>(passwordStatusTypeAtom);
  const [passwordSetModalState, setPasswordSetModalState,] = useRecoilState<PasswordSetModalState>(passwordSetModalStateAtom);

  const passwordInputElement = useRef<HTMLInputElement>(null);
  const validateInputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const setMainPasswordHandler = (_event, response: MainPasswordResponse) => {
      if (response.error === null) {
        setPasswordStatusType('VALIDATE');
        setPasswordSetModalState({
          isOpen: false,
        });
        clear();
      }
    };
    global.ipcRenderer.addListener('setMainPassword', setMainPasswordHandler);

    return () => {
      global.ipcRenderer.removeListener('setMainPassword', setMainPasswordHandler);
    };
  }, []);

  const onClickPasswordShowButton = () => {
    setShowPassword(!isShowPassword);
  };

  const onClickValidateShowButton = () => {
    setShowValidate(!isShowValidate);
  };

  const onChangePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setPassword(value);
    setDisabledSaveButton(value === '' || validate === '' || value !== validate);
  };

  const onChangeValidateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setValidate(value);
    setDisabledSaveButton(password === '' || value === '' || password !== value);
  };

  const onKeyUpPasswordInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && password.length > 0) {
      validateInputElement.current.focus();
    }
  };

  const onKeyUpValidateInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !disabledSaveButton) {
      onClickSaveButton();
    }
  };

  const onClickSaveButton = () => {
    savePassword();
  };

  const savePassword = () => {
    BrowserStorage.setPassword(password);
    global.ipcRenderer.send('setMainPassword', {
      password,
    });
  };

  function clear () {
    setShowPassword(false);
    setShowValidate(false);
    setPassword('');
    setValidate('');
    setDisabledSaveButton(true);
  }

  return (
    <Modal isOpen={passwordSetModalState.isOpen} size='sm' onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>초기 비밀번호 설정</ModalHeader>
        <ModalBody pb={6}>
          <VStack spacing={2}>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={isShowPassword ? 'text' : 'password'}
                placeholder='비밀번호'
                value={password}
                onChange={onChangePasswordInput}
                onKeyUp={onKeyUpPasswordInput}
                ref={passwordInputElement}
                tabIndex={1}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onClickPasswordShowButton}>{isShowPassword ? '가리기' : '보이기'}</Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={isShowValidate ? 'text' : 'password'}
                placeholder='확인'
                value={validate}
                onChange={onChangeValidateInput}
                onKeyUp={onKeyUpValidateInput}
                ref={validateInputElement}
                tabIndex={2}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onClickValidateShowButton}>{isShowValidate ? '가리기' : '보이기'}</Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
          <Text marginTop='1rem' fontSize='small' color='gray.600'>초기 비밀번호는 다시 찾을 수 없습니다.</Text>
          <Text fontSize='small' color='gray.600'>비밀번호를 초기화 하는 경우 등록해 놓은 OTP 데이터는 삭제 됩니다.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={onClickSaveButton} disabled={disabledSaveButton} tabIndex={3}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordSetModal;
