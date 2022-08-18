import type { Event, Store } from 'effector'

import type { BaseErrorsMeta } from './errors'
import type { ResolveResult } from './resolver'

export enum KIND {
  CONTROL = 'control/field',
  FORM = 'control/form',
}

export type Controls = Record<string, Control<any>>

export interface Control<TValue> extends BaseErrorsMeta {
  kind: KIND
  reset: Event<unknown>
  onChange: Event<TValue>
  onBlur: Event<unknown>
  $value: Store<TValue>
  $isTouched: Store<boolean>
}

export interface Form extends BaseErrorsMeta {
  kind: KIND
  $values: Store<Record<string, any>>
  restore: Event<void | any>
  controls: Controls
  $ownErrors: Store<ResolveResult>
  $childErrors: Store<ResolveResult[]>
  $touchedControls: { [key: string]: Store<boolean> }
  $allErrors: any
}
