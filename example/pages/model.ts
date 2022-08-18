import { createControl, createForm } from '@efform/core'
import { zodResolver } from '@efform/resolvers/zod'
import { createEvent, sample } from 'effector'
import * as z from 'zod'

export const email = createControl({
  defaultValue: '',
  resolver: zodResolver(z.string().email()),
})

export const password = createControl({ defaultValue: '' })
export const repeatPassword = createControl({ defaultValue: '' })

export const form = createForm({
  controls: { email, password, repeatPassword },
})

export const formSubmitted = createEvent()

export const submit = sample({
  clock: formSubmitted,
  source: form.$values,
})
