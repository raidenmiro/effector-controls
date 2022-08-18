import { useUnit } from 'effector-react'
import React from 'react'

import { Control } from '../types'

export interface ChangeHandler {
  target: any
}

export interface Register {
  onChange(evt: ChangeHandler): void
  onBlur(): void
  value: any
}

export function createViewControl<Props extends Record<string, unknown>>(config: {
  view: React.FC<Props & { register: Register }>
  control: Control<any>
}) {
  const { control, view } = config

  const bind = {
    onChange: (evt: ChangeHandler) => {
      control.onChange(evt.target.value)
    },
    onBlur: () => {
      control.onBlur()
    },
  }

  return (props: Props) => {
    const value = useUnit({ value: control.$value })
    const elementProps = Object.assign({}, props, { register: { ...bind, ...value } })
    const View = view

    return <View {...elementProps} />
  }
}
