import type { ControlError } from './errors'

export interface ResolveError {
  errors: Record<string, ControlError>
}
export interface ResolveSuccess {
  errors: Record<string, never>
}

export type ResolveResult = ResolveError | ResolveSuccess

export type Resolver<TValue> = (value: TValue) => ResolveResult
