import { useUnit } from 'effector-react'
import React from 'react'

import type { Control, ResolveResult } from '../types'
import { isEmpty } from '../utils'

export function createErrorView<Props extends Record<string, unknown>>(config: {
  control: Control<any>
  render: React.FC<Props & ResolveResult>
}) {
  const { render, control } = config

  const View = (props: Props) => {
    const { errors } = useUnit(control.$errors)
    const elementProps = Object.assign({}, { errors }, props)

    if (isEmpty(errors)) return null

    const result = render(elementProps)

    return result
  }

  return View
}
