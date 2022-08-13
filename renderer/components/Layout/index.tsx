import React, { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import { Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, VStack, Text, Center, } from '@chakra-ui/react';
import { HamburgerIcon, } from '@chakra-ui/icons';
import { OtpUpdateModal, OtpDeleteModal, PasswordModal, PasswordSetModal, OtpCreateModal, PasswordResetModal, } from '../Modal';
import { AddIcon, SignOutIcon, } from '../../icons';

import { useSetRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, passwordSetModalStateAtom, passwordModalStateAtom, otpCreateModalStateAtom, } from '../../store';

import { OtpCreateModalState, PasswordModalState, PasswordSetModalState, PasswordStatusType, ValidatePasswordResponse, } from '../../../electron-src/interfaces';
import { BrowserStorage, } from '../../utils';

type Props = {
  children: ReactNode
  title: string
}

const Layout = ({
  children, title,
}: Props) => {

  const setPasswordStatusType = useSetRecoilState<PasswordStatusType>(passwordStatusTypeAtom);
  const setPasswordSetModalState = useSetRecoilState<PasswordSetModalState>(passwordSetModalStateAtom);
  const setPasswordModalState = useSetRecoilState<PasswordModalState>(passwordModalStateAtom);
  const setOtpCreateModalState = useSetRecoilState<OtpCreateModalState>(otpCreateModalStateAtom);

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

    global.ipcRenderer.send('validatePassword', {
      password: BrowserStorage.getPassword(),
    });

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

  const menuElement = <Menu>
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
          borderBottomColor='gray.200'
          // height='4rem'
        >
          <Text fontSize='lg' fontWeight={600}>OTP Manager</Text>
          <Container position='absolute' right={0} width='auto'>
            {menuElement}
          </Container>
        </Center>
        <VStack overflow='auto'>
          <Container padding={0}>
            {children}
          </Container>
          <Spacer/>
        </VStack>
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
