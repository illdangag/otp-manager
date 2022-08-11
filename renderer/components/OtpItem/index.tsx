import { Box, CircularProgress, Text, Button, HStack, useToast, } from '@chakra-ui/react';
import { OtpCode, } from '../../../electron-src/interfaces';

interface Props {
  otpCode: OtpCode,
}

const OtpItem = ({
  otpCode,
}: Props) => {
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

  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <HStack>
        <Text fontSize='md'>{`${otpCode.issuer} (${otpCode.user})`}</Text>
      </HStack>
      <HStack>
        <Text marginLeft='auto' marginRight='auto' fontSize='xx-large'>{otpCode.code}</Text>
        <CircularProgress value={otpCode.progress} color={otpCode.progress < 80 ? 'green.300' : 'red.300'}/>
        <Button size='sm' onClick={onClickCopy}>OTP 복사</Button>
      </HStack>
    </Box>
  );
};

export default OtpItem;
