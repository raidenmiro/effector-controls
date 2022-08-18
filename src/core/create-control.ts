import { createEvent, createStore } from 'effector'

import { Control, KIND, Resolver, ResolveResult } from '../types'
import { baseErrorMeta } from './base-error-meta'

export const createControl = <T>(config: { defaultValue: T; resolver?: Resolver<T> }): Control<T> => {
  const reset = createEvent<unknown>()
  const onBlur = createEvent<unknown>()
  const onChange = createEvent<T>()

  const $isTouched = createStore(false)
    .on(onBlur, () => true)
    .reset(reset)
  const $value = createStore(config.defaultValue)
    .on(onChange, (_, next) => next)
    .reset(reset)

  const $errors = createStore<ResolveResult>({ errors: {} }).reset(reset)
  const metaErrors = baseErrorMeta({ errors: $errors })

  if (config.resolver) {
    $errors.on($value, (_, next) => config.resolver!(next))
  }

  return {
    kind: KIND.CONTROL,
    reset,
    $value,
    onBlur,
    $errors,
    onChange,
    $isTouched,
    ...metaErrors,
  }
}
