import { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';
import {
  Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, VStack, Text, Center, useColorMode, MenuDivider, useToast, HStack,
} from '@chakra-ui/react';
import { HamburgerIcon, } from '@chakra-ui/icons';
import { OtpUpdateModal, OtpDeleteModal, PasswordModal, PasswordSetModal, OtpCreateModal, PasswordResetModal, } from '../Modal';
import { AddIcon, SignOutIcon, LightModeIcon, DarkModeIcon, } from '../../icons';

import { useSetRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, passwordSetModalStateAtom, passwordModalStateAtom, otpCreateModalStateAtom, } from '../../store';

import { AutoUpdaterInfo, OtpCreateModalState, PasswordModalState, PasswordSetModalState, PasswordStatusType, ValidatePasswordResponse, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';

type Props = {
  children: ReactNode
  title: string
}

const Layout = ({
  children, title,
}: Props) => {

  const [footerMessage, setFooterMessage,] = useState<string>('');

  const setPasswordStatusType = useSetRecoilState<PasswordStatusType>(passwordStatusTypeAtom);
  const setPasswordSetModalState = useSetRecoilState<PasswordSetModalState>(passwordSetModalStateAtom);
  const setPasswordModalState = useSetRecoilState<PasswordModalState>(passwordModalStateAtom);
  const setOtpCreateModalState = useSetRecoilState<OtpCreateModalState>(otpCreateModalStateAtom);

  const toast = useToast();
  const { colorMode, toggleColorMode, } = useColorMode();

  useEffect(() => {
    const validatePasswordHandler = (_event, response: ValidatePasswordResponse) => {
      const passwordStatusType: PasswordStatusType = response.type;
      setPasswordStatusType(passwordStatusType);

      if (passwordStatusType === 'NOT_SETTING') {
        setPasswordSetModalState({
          isOpen: true,
        });
      } else if (passwordStatusType === 'INVALIDATE') {
        setPasswordModalState({
          isOpen: true,
        });
      }
    };
    global.ipcRenderer.addListener('validatePassword', validatePasswordHandler);

    const password: string = BrowserStorage.getPassword();
    if (password !== '') {
      global.ipcRenderer.send('validatePassword', {
        password,
      });
    } else {
      setPasswordModalState({
        isOpen: true,
      });
    }

    const autoUpdaterHandler = (_event, response: AutoUpdaterInfo) => {
      console.debug(response);
      switch (response.status) {
        case 'update-downloaded':
          toast({
            title: 'OTP Manager가 업데이트 되었습니다. 다시 시작 해주시기 바랍니다.', position: 'top', isClosable: true, duration: 999999,
          });
          break;
        case 'checking-for-update':
          setFooterMessage('업데이트 확인중...');
          break;
        case 'update-not-available':
          setFooterMessage('최신 버전');
          break;
        case 'download-progress':
          setFooterMessage(`업데이트 진행중 (${response.message})...`);
          break;
        default:
          break;
      }
    };
    global.ipcRenderer.on('autoUpdater', autoUpdaterHandler);

    return () => {
      global.ipcRenderer.removeListener('validatePassword', validatePasswordHandler);
    };
  }, []);

  const onClickCreateButton = () => {
    setOtpCreateModalState({
      isOpen: true,
    });
  };

  const onClickSignOutMenu = () => {
    BrowserStorage.clear();
    setPasswordModalState({
      isOpen: true,
    });
    setPasswordStatusType('INVALIDATE');
  };

  const onClickDisplayMode = () => {
    toggleColorMode();
  };

  const displayModeElement = (): ReactNode => {
    if (colorMode === 'dark') {
      return (<MenuItem icon={<LightModeIcon/>} onClick={onClickDisplayMode}>라이트 모드</MenuItem>);
    } else {
      return (<MenuItem icon={<DarkModeIcon/>} onClick={onClickDisplayMode}>다크 모드</MenuItem>);
    }
  };

  const menuElement = <Menu size='sm' direction='rtl'>
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<HamburgerIcon/>}
      variant='outline'
    />
    <MenuList>
      <MenuItem icon={<AddIcon/>} onClick={onClickCreateButton}>
        OTP 추가
      </MenuItem>
      {displayModeElement()}
      <MenuDivider/>
      <MenuItem icon={<SignOutIcon/>} onClick={onClickSignOutMenu}>
        로그아웃
      </MenuItem>
    </MenuList>
  </Menu>;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8'/>
        <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
      </Head>
      <Flex
        flexDirection='column'
        height='100vh'
      >
        <Center
          as='header'
          position='relative'
          paddingLeft='.4rem'
          paddingRight='.4rem'
          paddingTop='.8rem'
          paddingBottom='.8rem'
          borderBottomWidth='1px'
          borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Text fontSize='lg' fontWeight={600}>OTP Manager</Text>
          <Container position='absolute' left={0} width='auto'>
            {menuElement}
          </Container>
        </Center>
        <VStack overflow='auto'>
          <Container padding={0}>
            {children}
          </Container>
          <Spacer/>
        </VStack>
        <Spacer/>
        <HStack
          as='footer'
          paddingLeft='.4rem'
          paddingRight='.4rem'
          paddingTop='.2rem'
          paddingBottom='.2rem'
          borderTopWidth='1px'
          borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Text fontSize='xs'>{footerMessage}</Text>
          <Spacer/>
          <Text fontSize='xs'>v0.0.2</Text>
        </HStack>
      </Flex>
      <PasswordSetModal/>
      <PasswordModal/>
      <PasswordResetModal/>
      <OtpCreateModal/>
      <OtpUpdateModal/>
      <OtpDeleteModal/>
    </>
  );
};

export default Layout;
