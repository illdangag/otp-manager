import { useEffect, useState, } from 'react';
import { Box, CircularProgress, Heading, Text, Grid, GridItem, Button, Center, } from '@chakra-ui/react';
import Timeout = NodeJS.Timeout;

interface Props {
  title?: string,
  description?: string,
  otpCode?: string,
}

const OtpItem = ({
  title = '{TITLE}',
  description = '{DESC}',
  otpCode = '000000',
}: Props) => {
  const [optTimeValue, setOtpTimeValue,] = useState(0);

  useEffect(() => {
    const intervalId: Timeout = setInterval(() => {
      const now: Date = new Date();
      const time: number = now.getSeconds() * 1000 + now.getMilliseconds();
      const otpTimeValue: number = (time % 30000) / 30000 * 100;
      setOtpTimeValue(otpTimeValue);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(otpCode);
  };

  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <Heading fontSize='medium'>{title}</Heading>
      <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(5, 1fr)'>
        <GridItem colSpan={5} bg='tomato'>
          <Text>{description}</Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Center>
            <Text fontSize='xx-large'>{otpCode}</Text>
          </Center>
        </GridItem>
        <GridItem colSpan={2}>
          <CircularProgress value={optTimeValue} color='green.300'/>
        </GridItem>
        <GridItem colSpan={1}>
          <Button size='lg' onClick={onClickCopy}>COPY</Button>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default OtpItem;
