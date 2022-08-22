import { Text, Flex, Divider, Badge, Spacer, } from '@chakra-ui/react';

interface Props {
  title: string,
  link?: string,
  copyright?: string,
  license: string,
}

const OpenSourceLicense = ({
  title,
  link,
  copyright,
  license,
}: Props) => {
  return (
    <Flex flexDirection='column' padding='.8rem' borderWidth='1px' borderRadius='1rem' width='100%'>
      <Flex flexDirection='row' justifyContent='flex-start' alignItems='center'>
        <Text fontSize='sm'>{title}</Text>
        <Spacer/>
        <Badge variant='subtle'>{license}</Badge>
      </Flex>
      <Divider marginTop='.4rem' marginBottom='.4rem'/>
      <Flex flexDirection='column' justifyContent='flex-start'>
        {link && <Text fontSize='xs'>{link}</Text>}
        {copyright && <Text fontSize='xs'>{copyright}</Text>}
      </Flex>
    </Flex>
  );
};

export default OpenSourceLicense;
