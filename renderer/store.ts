import { atom, } from 'recoil';
import { v4, } from 'uuid';
import {
  PasswordStatusType,
  OtpUpdateModalState,
  OtpCreateModalState,
  PasswordResetModalState, PasswordModalState, PasswordSetModalState, Otp, OtpDeleteModalState,
} from '../electron-src/interfaces';

export const otpListAtom = atom<Otp[]>({
  key: 'otpListAtom/' + v4(),
  default: [],
});

export const passwordStatusTypeAtom = atom<PasswordStatusType>({
  key: 'passwordStatusTypeAtom/' + v4(),
  default: 'NOT_SETTING',
});

export const passwordSetModalStateAtom = atom<PasswordSetModalState>({
  key: 'passwordSetModalStateAtom/' + v4(),
  default: {
    isOpen: false,
  },
});

export const passwordModalStateAtom = atom<PasswordModalState>({
  key: 'passwordModalStateAtom/' + v4(),
  default: {
    isOpen: false,
  },
});

export const passwordResetModalStateAtom = atom<PasswordResetModalState>({
  key: 'passwordResetModalStateAtom/' + v4(),
  default: {
    isOpen: false,
  },
});

export const otpCreateModalStateAtom = atom<OtpCreateModalState>({
  key: 'otpCreateModalStateAtom/' + v4(),
  default: {
    isOpen: false,
  },
});

export const otpUpdateModalStateAtom = atom<OtpUpdateModalState>({
  key: 'otpUpdateModalStateAtom/' + v4(),
  default: {
    isOpen: false,
    otp: null,
  },
});

export const otpDeleteModalStateAtom = atom<OtpDeleteModalState>({
  key: 'otpDeleteModalStateAtom/' + v4(),
  default: {
    isOpen: false,
    otp: null,
  },
});
