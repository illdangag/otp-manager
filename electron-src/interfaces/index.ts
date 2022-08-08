export type Otp = {
  user: string
  secret: string
  issuer: string
}

export type PasswordStatusType = 'NOT_SETTING' | 'INVALIDATE' | 'VALIDATE';

export type PasswordStatus = {
  type: PasswordStatusType
}
