// react, element
import { Box, Container, Text, VStack, } from '@chakra-ui/react';
import { OtpListIcon, } from '../../icons';

// state management

// interface, util

const OtpEmpty = () => {
  return (
    <Box padding='1rem' borderWidth='1px' borderRadius='1rem' minWidth='10rem'>
      <VStack>
        <OtpListIcon boxSize='3.8rem' color='gray.300'/>
        <Container>
          <Text marginTop='.4rem' fontSize='lg'>등록된 OTP가 없습니다.</Text>
        </Container>
      </VStack>
    </Box>
  );
};

export default OtpEmpty;
