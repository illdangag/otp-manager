import { useEffect, useState, } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text, } from '@chakra-ui/react';
import { BrowserStorage, } from '../../utils';
import { Otp, } from '../../../electron-src/interfaces';

interface Props {
  isOpen?: boolean,
  onClose?: () => void,
  otpId: string,
}

const OtpEditModal = ({
  isOpen = false,
  onClose = () => {},
  otpId,
}: Props) => {

  useEffect(() => {
    const getOtpHandler = (_event, args) => {
      if (args.otp) {
        const otp: Otp = args.otp as Otp;

        setIssuer(otp.issuer);
        setUser(otp.user);

        const newIssuerDescription: string = otp.issuerDescription ? otp.issuerDescription : '';
        const newUserDescription: string = otp.userDescription ? otp.userDescription : '';
        setIssuerDescription(newIssuerDescription);
        setUserDescription(newUserDescription);
      }
    };
    global.ipcRenderer.addListener('getOtp', getOtpHandler);

    const updateOtpHandler = (_event, args) => {
      const error: string | null = args.error;
      if (error === null) {
        onClose();
        global.ipcRenderer.send('getOtpList', {
          password: BrowserStorage.getPassword(),
        });
      }
    };
    global.ipcRenderer.addListener('updateOtp', updateOtpHandler);

    return () => {
      global.ipcRenderer.removeListener('getOtp', getOtpHandler);
      global.ipcRenderer.removeListener('updateOtp', updateOtpHandler);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      global.ipcRenderer.send('getOtp', {
        id: otpId,
        password: BrowserStorage.getPassword(),
      });
    }
  }, [isOpen,]);

  const [issuer, setIssuer,] = useState<string>('');
  const [user, setUser,] = useState<string>('');

  const [issuerDescription, setIssuerDescription,] = useState<string>('');
  const [userDescription, setUserDescription,] = useState<string>('');

  const onChangeIssuer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIssuer: string = event.target.value;
    setIssuerDescription(newIssuer);
  };

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUser: string = event.target.value;
    setUserDescription(newUser);
  };

  const onClickSave = () => {
    global.ipcRenderer.send('updateOtp', {
      password: BrowserStorage.getPassword(),
      otp: {
        id: otpId,
        issuerDescription,
        userDescription,
      } as Otp,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)'/>
      <ModalContent>
        <ModalHeader>OTP 수정</ModalHeader>
        <ModalBody pb={6}>
          <Text>Issuer</Text>
          <Input
            marginTop='0.2rem'
            placeholder={issuer}
            value={issuerDescription}
            onChange={onChangeIssuer}
          />
          <Text marginTop='1rem'>User</Text>
          <Input
            marginTop='0.2rem'
            placeholder={user}
            value={userDescription}
            onChange={onChangeUser}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight='1rem' onClick={onClose}>취소</Button>
          <Button colorScheme='blue' onClick={onClickSave}>저장</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpEditModal;
