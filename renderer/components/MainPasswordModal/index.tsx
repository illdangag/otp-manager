import styles from './index.module.scss';
import { useEffect, useState, } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, InputGroup, InputRightElement, VStack, Text,
} from '@chakra-ui/react';

interface Props {
  isOpen?: boolean,
  onClose?: () => void,
}

const MainPasswordModal = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {

  const [isShowPassword, setShowPassword,] = useState(false);
  const [isShowValidate, setShowValidate,] = useState(false);
  const [password, setPassword,] = useState('');
  const [validate, setValidate,] = useState('');
  const [disabledSaveButton, setDisabledSaveButton,] = useState(true);

  useEffect(() => {
    const setMainPasswordHandler = (_event, args) => {
      if (args.result) {
        onClose();
      }
    };
    global.ipcRenderer.addListener('setMainPassword', setMainPasswordHandler);
    return () => {
      global.ipcRenderer.removeListener('setMainPassword', setMainPasswordHandler);
    };
  }, []);

  const onClickPasswordShow = () => {
    setShowPassword(!isShowPassword);
  };

  const onClickValidateShow = () => {
    setShowValidate(!isShowValidate);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setPassword(value);
    setDisabledSaveButton(value === '' || validate === '' || value !== validate);
  };

  const onChangeValidate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setValidate(value);
    setDisabledSaveButton(password === '' || value === '' || password !== value);
  };

  const onClickSave = () => {
    global.ipcRenderer.send('setMainPassword', password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
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
                onChange={onChangePassword}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onClickPasswordShow}>{isShowPassword ? '가리기' : '보이기'}</Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={isShowValidate ? 'text' : 'password'}
                placeholder='확인'
                value={validate}
                onChange={onChangeValidate}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onClickValidateShow}>{isShowValidate ? '가리기' : '보이기'}</Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
          <div className={styles.description}>
            <Text fontSize='small'>초기 비밀번호는 다시 찾을 수 없습니다.</Text>
            <Text fontSize='small'>비밀번호를 초기화 하는 경우 등록해 놓은 OTP 데이터는 삭제 됩니다.</Text>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={onClickSave} disabled={disabledSaveButton}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MainPasswordModal;
