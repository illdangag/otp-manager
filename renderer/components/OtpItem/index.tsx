import { useEffect, useState, } from 'react';
import { Box, CircularProgress, Text, Button, HStack, } from '@chakra-ui/react';
import Timeout = NodeJS.Timeout;
import { Otp, } from '../../../electron-src/interfaces';
import totp from 'totp-generator';

interface Props {
  otp: Otp,
}

const OtpItem = ({
  otp,
}: Props) => {
  const [otpTimeValue, setOtpTimeValue,] = useState<number>(0);
  const [otpCode, setOtpCode,] = useState<string>('------');

  useEffect(() => {
    const intervalTime: number = 500;
    const intervalId: Timeout = setInterval(() => {
      const now: Date = new Date();
      const time: number = now.getSeconds() * 1000 + now.getMilliseconds();
      const newOtpTimeValue: number = (time % 30000) / 30000 * 100;
      setOtpTimeValue(newOtpTimeValue);
      if ((time % ( 30 * 1000)) <= intervalTime) {
        setOtpCode(totp(otp.secret));
      }
    }, intervalTime);
    setOtpCode(totp(otp.secret));
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(otpCode);
  };

  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <HStack>
        <Text fontSize='md'>{`${otp.issuer} (${otp.user})`}</Text>
      </HStack>
      <HStack>
        <Text marginLeft='auto' marginRight='auto' fontSize='xx-large'>{otpCode}</Text>
        <CircularProgress value={otpTimeValue} color={otpTimeValue < 80 ? 'green.300' : 'red.300'}/>
        <Button size='sm' onClick={onClickCopy}>OTP 복사</Button>
      </HStack>
    </Box>
  );
};

export default OtpItem;
