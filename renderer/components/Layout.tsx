import React, { ReactNode, useEffect, useState, } from 'react';
import Head from 'next/head';

import MainPasswordModal from './MainPasswordModal';
import { PasswordStatus, } from '../../electron-src/interfaces';
import PasswordModal from './PasswordModal';
import { BrowserStorage, } from '../utils';
import { HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from '@chakra-ui/icons';
import SignOutIcon from '../icons/SignOutIcon';

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'This is the default title',
}: Props) => {

  const [isOpenMainPasswordModal, setOpenMainPasswordModal,] = useState(false);
  const [isOpenPasswordModal, setOpenPasswordModal,] = useState(false);

  useEffect(() => {
    const getSettingHandler = (_event, args) => {
      const passwordStatus: PasswordStatus = args as PasswordStatus;
      if (passwordStatus.type === 'NOT_SETTING') {
        setOpenMainPasswordModal(true);
      } else if (passwordStatus.type === 'INVALIDATE') {
        setOpenPasswordModal(true);
      }
      global.ipcRenderer.send('getOtps', {
        password: BrowserStorage.getPassword(),
      });
    };
    global.ipcRenderer.addListener('getSetting', getSettingHandler);

    global.ipcRenderer.send('getSetting', {
      password: BrowserStorage.getPassword(),
    });

    return () => {
      global.ipcRenderer.removeListener('getSetting', getSettingHandler);
    };
  }, []);

  const onCloseMainPasswordModal = () => {
    setOpenMainPasswordModal(false);
  };

  const onClosePasswordModal = (isResetPassword: boolean) => {
    setOpenPasswordModal(false);
    if (isResetPassword) {
      global.ipcRenderer.send('getSetting', {
        password: '',
      });
    }
  };

  const onClickAdd = () => {
    console.log('add');
  }

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
              <MenuItem icon={<AddIcon />} onClick={onClickAdd}>
                Add OTP
              </MenuItem>
              <MenuItem icon={<SignOutIcon boxSize='1.2rem' color='red.300'/>} command='⌘N'>
                New Window
              </MenuItem>
              <MenuItem icon={<RepeatIcon />} command='⌘⇧N'>
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<EditIcon />} command='⌘O'>
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </header>
      {children}
      <footer>
        <hr/>
        <span>I'm here to stay (Footer)</span>
      </footer>
      <MainPasswordModal isOpen={isOpenMainPasswordModal} onClose={onCloseMainPasswordModal}/>
      <PasswordModal isOpen={isOpenPasswordModal} onClose={onClosePasswordModal}/>
    </div>
  );
};

export default Layout;
