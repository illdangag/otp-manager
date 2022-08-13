import { Box, CircularProgress, Text, Button, HStack, useToast, IconButton, Spacer, } from '@chakra-ui/react';
import { OtpCode, OtpDeleteModalState, OtpUpdateModalState, } from '../../../electron-src/interfaces';
import EditIcon from '../../icons/EditIcon';
import { DeleteIcon, } from '../../icons';
import { useSetRecoilState, } from 'recoil';
import { otpUpdateModalStateAtom, otpDeleteModalStateAtom, } from '../../store';

interface Props {
  otpCode: OtpCode,
}

const OtpItem = ({
  otpCode,
}: Props) => {
  const setOtpUpdateModalState = useSetRecoilState<OtpUpdateModalState>(otpUpdateModalStateAtom);
  const setOtpDeleteModalState = useSetRecoilState<OtpDeleteModalState>(otpDeleteModalStateAtom);
  const toast = useToast();

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(otpCode.code);
    showCopyToast();
  };

  function showCopyToast () {
    toast({
      title: `${otpCode.code} 복사`,
      position: 'top',
      duration: 2000,
    });
  }

  const onClickEditButton = () => {
    setOtpUpdateModalState({
      isOpen: true,
      otp: otpCode.otp,
    });
  };

  const onClickDeleteButton = () => {
    setOtpDeleteModalState({
      isOpen: true,
      otp: otpCode.otp,
    });
  };

  const getTitle = () => {
    return `${otpCode.otp.issuerDescription ? otpCode.otp.issuerDescription : otpCode.otp.issuer} ` +
     `(${otpCode.otp.userDescription ? otpCode.otp.userDescription : otpCode.otp.user})`;
  };

  return (
    <>
      <Box padding='1rem' borderWidth='1px' borderRadius='1rem'>
        <HStack>
          <Text fontSize='md'>{getTitle()}</Text>
          <Spacer/>
          <IconButton aria-label='Edit OTP' variant='link' size='sm' icon={<EditIcon/>} onClick={onClickEditButton}/>
          <IconButton aria-label='Delete OTP' variant='link' size='sm' icon={<DeleteIcon/>} onClick={onClickDeleteButton}/>
        </HStack>
        <HStack>
          <Text marginLeft='auto' marginRight='auto' fontSize='xx-large'>{otpCode.code}</Text>
          <CircularProgress value={otpCode.progress} color={otpCode.progress < 80 ? 'green.300' : 'red.300'}/>
          <Button size='sm' onClick={onClickCopy}>OTP 복사</Button>
        </HStack>
      </Box>
    </>
  );
};

export default OtpItem;
