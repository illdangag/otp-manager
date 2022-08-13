import React, { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import PasswordSetModal from '../PasswordSetModal';
import { OtpCreateModalState, PasswordModalState, PasswordSetModalState, PasswordStatusType, ValidatePasswordResponse,
} from '../../../electron-src/interfaces';
import PasswordModal from '../PasswordModal';
import { BrowserStorage, } from '../../utils';
import { HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, } from '@chakra-ui/react';
import { HamburgerIcon, } from '@chakra-ui/icons';
import { AddIcon, SignOutIcon, } from '../../icons';
import OtpCreateModal from '../OtpCreateModal';
import { useSetRecoilState, } from 'recoil';
import { passwordStatusTypeAtom, passwordSetModalStateAtom, passwordModalStateAtom, otpCreateModalStateAtom,
} from '../../store';
import PasswordResetModal from '../PasswordResetModal';
import OtpUpdateModal from '../OtpUpdateModal';
import OtpDeleteModal from '../OtpDeleteModal';

type Props = {
  children: ReactNode
  title: string
}

const Layout = ({
  children,
  title,
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

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <header>
        <HStack padding='.4rem'>
          <Spacer/>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
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
          </Menu>
        </HStack>
      </header>
      {children}
      <footer>
      </footer>
      <PasswordSetModal/>
      <PasswordModal/>
      <PasswordResetModal/>
      <OtpCreateModal/>
      <OtpUpdateModal/>
      <OtpDeleteModal/>
    </div>
  );
};

export default Layout;
