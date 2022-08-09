import { useEffect, useState, } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, InputGroup, InputRightElement, VStack, Text,
} from '@chakra-ui/react';
import { PasswordStatus } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';

interface Props {
  isOpen?: boolean,
  onClose?: () => void,
}

const PasswordModal = ({
  isOpen = false,
  onClose = () => {},
}: Props) => {

  const [password, setPassword,] = useState('');
  const [isShowPassword, setShowPassword,] = useState(false);

  useEffect(() => {
    const getSettingHandler = (_event, args) => {
      const passwordStatus: PasswordStatus = args as PasswordStatus;
      if (passwordStatus.type === 'VALIDATE') {
        onClose();
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
    global.ipcRenderer.send('getSetting', {
      password,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>비밀번호 입력</ModalHeader>
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
                <Button h='1.75rem' size='sm' onClick={onClickShowPassword}>{isShowPassword ? '가리기' : '보이기'}</Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' disabled={password.length === 0} onClick={onClickSave}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
