import { useState, } from 'react';
import { Box, CircularProgress, Text, Button, HStack, useToast, IconButton, Spacer, } from '@chakra-ui/react';
import OtpEditModal from '../OtpEditModal';
import { OtpCode, } from '../../../electron-src/interfaces';
import EditIcon from '../../icons/EditIcon';

interface Props {
  otpCode: OtpCode,
}

const OtpItem = ({
  otpCode,
}: Props) => {
  const toast = useToast();

  const [isOpenEditModal, setOpenEditModal,] = useState<boolean>(false);

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

  const onClickEdit = () => {
    setOpenEditModal(true);
  };

  const onCloseOtpEditModal = () => {
    setOpenEditModal(false);
  }

  const getTitle = () => {
    return `${otpCode.issuerDescription ? otpCode.issuerDescription : otpCode.issuer} ` +
     `(${otpCode.userDescription ? otpCode.userDescription : otpCode.user})`;
  }

  return (
    <>
      <Box p={5} shadow='md' borderWidth='1px'>
        <HStack>
          <Text fontSize='md'>{getTitle()}</Text>
          <Spacer/>
          <IconButton aria-label='Edit OTP' variant='link' size='sm' icon={<EditIcon/>} onClick={onClickEdit}/>
        </HStack>
        <HStack>
          <Text marginLeft='auto' marginRight='auto' fontSize='xx-large'>{otpCode.code}</Text>
          <CircularProgress value={otpCode.progress} color={otpCode.progress < 80 ? 'green.300' : 'red.300'}/>
          <Button size='sm' onClick={onClickCopy}>OTP 복사</Button>
        </HStack>
      </Box>
      <OtpEditModal
        otpId={otpCode.id}
        isOpen={isOpenEditModal}
        onClose={onCloseOtpEditModal}
      />
    </>
  );
};

export default OtpItem;
