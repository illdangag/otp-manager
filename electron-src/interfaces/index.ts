export interface Otp {
  id?: string
  user: string
  issuer: string
  secret: string
  userDescription: string
  issuerDescription: string
  description: string
}

export interface OtpCode {
  otp: Otp,
  code: string
  progress: number
}

const PasswordStatusType = {
  NOT_SETTING: 'NOT_SETTING',
  INVALIDATE: 'INVALIDATE',
  VALIDATE: 'VALIDATE',
} as const;
export type PasswordStatusType = typeof PasswordStatusType[keyof typeof PasswordStatusType];

// ipc interface
interface IpcRequest {
  password: string,
  callbackChannel?: string, // 특정한 handler에게만 응답을 받기 위함
}
interface IpcResponse {
  error: string | null,
}

export interface MainPasswordRequest extends IpcRequest {
}
export interface MainPasswordResponse extends IpcResponse {
}

export interface ValidatePasswordRequest extends IpcRequest {
}
export interface ValidatePasswordResponse extends IpcResponse {
  type: PasswordStatusType,
  otpList: Otp[],
}

export interface ClearRequest extends IpcRequest {
}
export interface ClearResponse extends IpcResponse {
}

export interface CreateOtpRequest extends IpcRequest {
  otp: Otp,
}
export interface CreateOtpResponse extends IpcResponse {
  otpList: Otp[],
}

export interface GetOtpListRequest extends IpcRequest {
}
export interface GetOtpListResponse extends IpcResponse {
  otpList: Otp[],
  passwordStatusType: PasswordStatusType,
}

export interface UpdateOtpRequest extends IpcRequest {
  otp: Otp,
}
export interface UpdateOtpResponse extends IpcResponse {
  otpList: Otp[],
}

export interface DeleteOtpRequest extends IpcRequest {
  id: string,
}
export interface DeleteOtpResponse extends IpcResponse {
  otpList: Otp[],
}

export interface OtpTrayMenuRequest extends IpcRequest {
  otpCodeList: OtpCode[],
}

export interface OtpSwapRequest extends IpcRequest {
  from: number;
  to: number;
}
export interface OtpSwapResponse extends IpcResponse {
}

// recoil state
interface ModalState {
  isOpen: boolean,
}
export interface PasswordSetModalState extends ModalState {
}
export interface PasswordModalState extends ModalState {
}
export interface PasswordResetModalState extends ModalState {
}
export interface OtpURLCreateModalState extends ModalState {
}
export interface OtpQrCodeCreateModalState extends ModalState {
}
export interface OtpUpdateModalState extends ModalState {
  otp: Otp | null,
}
export interface OtpDeleteModalState extends ModalState {
  otp: Otp | null,
}
