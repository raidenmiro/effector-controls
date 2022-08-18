import type { Store } from 'effector'

import type { ResolveError } from '../types/resolver'
import { isEmpty, not } from '../utils'

export const baseErrorMeta = (config: { errors: Store<ResolveError> }) => {
  const { errors } = config

  const $valid = errors.map(({ errors }) => isEmpty(errors))
  const $isDirty = errors.map(({ errors }) => not(isEmpty(errors)))

  return {
    $valid,
    $isDirty,
  }
}
