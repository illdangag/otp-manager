export type Otp = {
  id?: string
  user: string
  secret: string
  issuer: string
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
