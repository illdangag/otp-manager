// react, element
import { Box, Button, Center, Container, Text, VStack, } from '@chakra-ui/react';
import { OtpListIcon, } from '../../icons';

// state management
import { useSetRecoilState, } from 'recoil';
import { otpURLCreateModalStateAtom, } from '../../store';

// interface, util
import { OtpURLCreateModalState, } from '../../../electron-src/interfaces';

const OtpEmpty = () => {
  const setOtpURLCreateModalState = useSetRecoilState<OtpURLCreateModalState>(otpURLCreateModalStateAtom);

  const onClickAddButton = () => {
    setOtpURLCreateModalState({
      isOpen: true,
    });
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
    </>
  );
};

export default OtpEmpty;
