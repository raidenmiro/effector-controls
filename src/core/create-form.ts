import { combine, createEvent, createStore, sample, split } from 'effector'

import { Controls, Form, KIND, Resolver, ResolveResult } from '../types'

export const createForm = <TControls extends Controls>(config: {
  controls: TControls
  resolver?: Resolver<{ [key: string]: any }>
}): Form => {
  const restore = createEvent<void | Record<string, unknown>>()

  const { fieldsValues, touchedList } = extractState(config.controls)
  const $values = combine(fieldsValues)

  const { reset, __: push } = split(restore, {
    reset: Boolean,
  })

  const $childErrors = combine(Object.values(config.controls).map(({ $errors }) => $errors))
  const $ownErrors = createStore<ResolveResult>({ errors: {} }).reset(reset)
  const $allErrors = combine([$childErrors, $ownErrors], ([childErrors, ownErrors]) => {
    const allErrors = [
      ...childErrors.map(({ errors }) => (Object.keys(errors).length > 0 ? errors : null)),
      ...Object.values(ownErrors.errors),
    ].filter(Boolean)

    return allErrors
  })

  const $errors = createStore<ResolveResult>({ errors: {} })
  const $valid = $allErrors.map((errors) => errors.length === 0)
  const $isDirty = $allErrors.map((errors) => errors.length > 0)

  for (const key in config.controls) {
    const control = config.controls[key]

    sample({ clock: reset, target: control.reset })

    sample({
      clock: push,
      source: $values,
      fn: (form) => form[key],
      target: control.$value,
    })
  }

  if (config.resolver) {
    $ownErrors.on($values, (_, next) => config.resolver?.(next))
  }

  return {
    kind: KIND.FORM,
    $valid,
    $values,
    restore,
    $errors,
    $isDirty,
    $allErrors,
    $ownErrors,
    $childErrors,
    $touchedControls: touchedList,
    controls: config.controls,
  }
}

const extractState = (controls: Controls) => {
  const extractValues: { [key in keyof Controls]: Controls[key]['$value'] } = {}
  const extractTouchedFields: { [key in keyof Controls]: Controls[key]['$isTouched'] } = {}

  for (const key in controls) {
    const field = controls[key]

    extractValues[key] = field.$value
    extractTouchedFields[key] = field.$isTouched
  }

  return {
    fieldsValues: extractValues,
    touchedList: extractTouchedFields,
  }
}
