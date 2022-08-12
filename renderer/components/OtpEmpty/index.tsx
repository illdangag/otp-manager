import { useState, } from 'react';
import { Box, Button, Center, Container, Text, VStack, } from '@chakra-ui/react';
import { OtpListIcon, } from '../../icons';
import OtpURLModal from '../OtpURLModal';

const OtpEmpty = () => {

  const [isOpenOtpURLModal, setOpenOtpURLModal,] = useState<boolean>(false);

  const onClickAddButton = () => {
    setOpenOtpURLModal(true);
  };

  const onCloseOtpURLModal = () => {
    setOpenOtpURLModal(false);
  };

  return (
    <>
      <Box padding='1rem' borderWidth='1px' borderRadius='1rem' minWidth='10rem'>
        <VStack>
          <OtpListIcon boxSize='3.8rem' color='gray.300'/>
          <Container>
            <Text marginTop='.4rem' fontSize='lg'>등록된 OTP가 없습니다.</Text>
          </Container>
          <Center>
            <Button marginTop='1rem' onClick={onClickAddButton}>추가</Button>
          </Center>
        </VStack>
      </Box>
      <OtpURLModal isOpen={isOpenOtpURLModal} onClose={onCloseOtpURLModal}/>
    </>
  );
};

export default OtpEmpty;
