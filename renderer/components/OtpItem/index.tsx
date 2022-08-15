// react, element
import { Box, CircularProgress, Text, Button, HStack, useToast, IconButton, Spacer, VStack,
  Divider, } from '@chakra-ui/react';
import { CopyIcon, EditIcon, DeleteIcon, } from '../../icons';

// state management
import { useSetRecoilState, } from 'recoil';
import { otpUpdateModalStateAtom, otpDeleteModalStateAtom, } from '../../store';

// interface, util
import { OtpCode, OtpDeleteModalState, OtpUpdateModalState, } from '../../../electron-src/interfaces';

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
      title: `${otpCode.code} 복사`, position: 'top', duration: 2000,
    });
  }

  const onClickEditButton = () => {
    setOtpUpdateModalState({
      isOpen: true, otp: otpCode.otp,
    });
  };

  const onClickDeleteButton = () => {
    setOtpDeleteModalState({
      isOpen: true, otp: otpCode.otp,
    });
  };

  return (
    <>
      <Box padding='.8rem' borderWidth='1px' borderRadius='1rem'>
        <HStack>
          <VStack spacing={0}>
            <Text width='100%' fontSize='lg'>
              {otpCode.otp.issuerDescription ? otpCode.otp.issuerDescription : otpCode.otp.issuer}
            </Text>
            <Text width='100%' fontSize='sm'>
              {otpCode.otp.userDescription ? otpCode.otp.userDescription : otpCode.otp.user}
            </Text>
          </VStack>
          <Spacer/>
          <IconButton aria-label='Edit OTP' variant='outline' size='sm' icon={<EditIcon/>} onClick={onClickEditButton}/>
          <IconButton aria-label='Delete OTP' variant='outline' size='sm' icon={<DeleteIcon/>} onClick={onClickDeleteButton}/>
        </HStack>
        <Divider marginTop='.4rem' marginBottom='.4rem'/>
        {otpCode.otp.description && (
          <>
            <Text fontSize='sm'>{otpCode.otp.description}</Text>
            <Divider marginTop='.4rem' marginBottom='.4rem'/>
          </>
        )}
        <HStack>
          <Text marginLeft='auto' marginRight='auto' fontSize='3xl' color={otpCode.progress < 80 ? null : 'red.300'}>{otpCode.code}</Text>
          <CircularProgress value={otpCode.progress} color={otpCode.progress < 80 ? 'green.300' : 'red.300'}/>
          <Button size='sm' leftIcon={<CopyIcon/>} onClick={onClickCopy}>복사</Button>
        </HStack>
      </Box>
    </>
  );
};

export default OtpItem;
