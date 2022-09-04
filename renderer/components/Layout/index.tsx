// react, element
import { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, VStack, Text, Center, useColorMode, MenuDivider,
  HStack, } from '@chakra-ui/react';
import { HamburgerIcon, } from '@chakra-ui/icons';
import { OtpUpdateModal, OtpDeleteModal, PasswordModal, PasswordSetModal, OtpURLCreateModal, PasswordResetModal,
  OtpQrCodeCreateModal, } from '../Modal';
import { LinkIcon, SignOutIcon, LightModeIcon, DarkModeIcon, InfoIcon, QrCodeIcon, } from '../../icons';

// state management
import { useSetRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, passwordSetModalStateAtom, passwordModalStateAtom, otpURLCreateModalStateAtom, otpListAtom,
  otpQrCodeCreateModalStateAtom, } from '../../store';

// interface, util
import {
  OtpURLCreateModalState, PasswordModalState, PasswordSetModalState, PasswordStatusType, ValidatePasswordResponse, Otp, OtpQrCodeCreateModalState,
} from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';
import packageJson from '../../../package.json';

type Props = {
  children: ReactNode
  title: string
  titleElement?: ReactNode
}

const Layout = ({
  children,
  title,
  titleElement,
}: Props) => {
  const setPasswordStatusType = useSetRecoilState<PasswordStatusType>(passwordStatusTypeAtom);
  const setPasswordSetModalState = useSetRecoilState<PasswordSetModalState>(passwordSetModalStateAtom);
  const setPasswordModalState = useSetRecoilState<PasswordModalState>(passwordModalStateAtom);
  const setOtpURLCreateModalState = useSetRecoilState<OtpURLCreateModalState>(otpURLCreateModalStateAtom);
  const setOtpQrCodeCreateModalState = useSetRecoilState<OtpQrCodeCreateModalState>(otpQrCodeCreateModalStateAtom);
  const setOtpList = useSetRecoilState<Otp[]>(otpListAtom);

  const { colorMode, toggleColorMode, } = useColorMode();
  const router = useRouter();

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
    global.ipcRenderer.send('validatePassword', {
      password,
    });

    return () => {
      global.ipcRenderer.removeListener('validatePassword', validatePasswordHandler);
    };
  }, []);

  const onClickURLCreateButton = () => {
    setOtpURLCreateModalState({
      isOpen: true,
    });
  };

  const onClickCqCodeCreateButton = () => {
    setOtpQrCodeCreateModalState({
      isOpen: true,
    });
  };

  const onClickSignOutMenu = () => {
    BrowserStorage.clear();
    setPasswordModalState({
      isOpen: true,
    });
    setOtpList([]);
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

  const onClickOpensourceLicense = async () => {
    void await router.push('/license');
  };

  const menuElement = <Menu direction='rtl'>
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<HamburgerIcon/>}
      variant='outline'
    />
    <MenuList>
      <MenuItem icon={<LinkIcon/>} onClick={onClickURLCreateButton}>
        URL로 OTP 추가
      </MenuItem>
      <MenuItem icon={<QrCodeIcon/>} onClick={onClickCqCodeCreateButton}>
        QR Code로 OTP 추가
      </MenuItem>
      <MenuDivider/>
      {displayModeElement()}
      <MenuDivider/>
      <MenuItem icon={<InfoIcon/>} onClick={onClickOpensourceLicense}>
        오픈소스 라이선스
      </MenuItem>
      <MenuItem icon={<SignOutIcon/>} onClick={onClickSignOutMenu}>
        로그아웃
      </MenuItem>
    </MenuList>
  </Menu>;

  return (
    <>
      <Head>
        <title>OTP Manager</title>
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
          flexBasis='3.2rem'
          flexShrink='0'
          paddingLeft='.4rem'
          paddingRight='.4rem'
          borderBottomWidth='1px'
          borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Text fontSize='lg' fontWeight={600}>{title}</Text>
          <Container position='absolute' left={0} width='auto'>
            {titleElement ? titleElement : menuElement}
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
          <Spacer/>
          <Text fontSize='xs'>v{packageJson.version}</Text>
        </HStack>
      </Flex>
      <PasswordSetModal/>
      <PasswordModal/>
      <PasswordResetModal/>
      <OtpURLCreateModal/>
      <OtpQrCodeCreateModal/>
      <OtpUpdateModal/>
      <OtpDeleteModal/>
    </>
  );
};

export default Layout;
