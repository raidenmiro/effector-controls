import type { Store } from 'effector'

import type { ResolveResult } from './resolver'

export interface BaseErrorsMeta {
  $valid: Store<boolean>
  $isDirty: Store<boolean>
  $errors: Store<ResolveResult>
}

export type Message = string

export type ValidateResult = Message | Message[] | boolean | undefined

export interface ControlError {
  type: string
  types?: Record<string, ValidateResult>
  message?: Message
}
