export type Otp = {
  id?: string
  user: string
  issuer: string
  secret: string
  userDescription: string
  issuerDescription: string
}

export type OtpCode = {
  id?: string
  user: string
  issuer: string
  userDescription: string
  issuerDescription: string
  code: string
  progress: number
}

const PasswordStatusType = {
  NOT_SETTING: 'NOT_SETTING',
  INVALIDATE: 'INVALIDATE',
  VALIDATE: 'VALIDATE',
} as const;
export type PasswordStatusType = typeof PasswordStatusType[keyof typeof PasswordStatusType];

export type PasswordStatus = {
  type: PasswordStatusType
}
