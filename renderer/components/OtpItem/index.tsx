import { useState, } from 'react';
import { Box, CircularProgress, Text, Button, HStack, useToast, IconButton, Spacer, } from '@chakra-ui/react';
import OtpEditModal from '../OtpEditModal';
import { OtpCode, } from '../../../electron-src/interfaces';
import EditIcon from '../../icons/EditIcon';
import { DeleteIcon, } from '../../icons';
import OtpDeleteModal from '../OtpDeleteModal';

interface Props {
  otpCode: OtpCode,
}

const OtpItem = ({
  otpCode,
}: Props) => {
  const toast = useToast();

  const [isOpenEditModal, setOpenEditModal,] = useState<boolean>(false);
  const [isOpenDeleteModal, setOpenDeleteModal,] = useState<boolean>(false);

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
    setOpenEditModal(true);
  };

  const onCloseEditModal = () => {
    setOpenEditModal(false);
  }

  const onClickDeleteButton = () => {
    setOpenDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const getTitle = () => {
    return `${otpCode.otp.issuerDescription ? otpCode.otp.issuerDescription : otpCode.otp.issuer} ` +
     `(${otpCode.otp.userDescription ? otpCode.otp.userDescription : otpCode.otp.user})`;
  }

  return (
    <>
      <Box p={5} shadow='md' borderWidth='1px'>
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
      <OtpEditModal
        otp={otpCode.otp}
        isOpen={isOpenEditModal}
        onClose={onCloseEditModal}
      />
      <OtpDeleteModal
        otp={otpCode.otp}
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};

export default OtpItem;
