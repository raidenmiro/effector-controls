/* eslint-disable effector/no-getState */
import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { zodResolver } from '../resolvers/zod'
import { createControl } from '../src/core/create-control'
import { createForm } from '../src/core/create-form'

describe('core form', () => {
  describe('createControl', () => {
    const email = createControl({
      defaultValue: '',
      resolver: zodResolver(z.string().email()),
    })

    it('should be show message about not valid email', () => {
      const expected = 'not valid email'

      email.onChange(expected)

      expect(email.$isDirty.getState()).toBeTruthy()
      expect(email.$value.getState()).toBe(expected)

      expect(email.$errors.getState()).toMatchObject({
        errors: { field: { message: 'Invalid email', type: 'invalid_string' } },
      })
    })

    it('should be if the mail is correct, the error is blank', () => {
      const expected = 'test@email.com'

      email.onChange(expected)

      expect(email.$isDirty.getState()).toBeFalsy()
      expect(email.$value.getState()).toBe(expected)

      expect(email.$errors.getState()).toMatchObject({
        errors: {},
      })
    })
  })

  describe('createForm', () => {
    it('should be check is valid confirm password', () => {
      const expected = {
        message: 'The passwords do not match',
        path: ['password'],
      }

      const password = createControl({
        defaultValue: '',
      })

      const repeatPassword = createControl({
        defaultValue: '',
      })

      const schema = z
        .object({
          password: z.string().min(5),
          repeatPassword: z.string(),
        })
        .refine(({ password, repeatPassword }) => password === repeatPassword, expected)

      const form = createForm({
        controls: { password, repeatPassword },
        resolver: zodResolver(schema),
      })

      password.onChange('password1')
      repeatPassword.onChange('password2')

      expect(form.$isValid.getState()).toBeFalsy()
      expect(form.$values.getState()).toMatchObject({
        password: 'password1',
        repeatPassword: 'password2',
      })
      expect(form.$ownErrors.getState()).toMatchObject({
        errors: { password: { type: 'custom', message: expected.message } },
      })
    })

    it('should show errors if a resolver is passed controls', () => {
      const control1 = createControl<string | number>({
        defaultValue: '',
        resolver: zodResolver(z.string()),
      })

      const control2 = createControl<string | number>({
        defaultValue: 2,
        resolver: zodResolver(z.number()),
      })

      const form = createForm({
        controls: { control1, control2 },
      })

      control1.onChange(123)
      control2.onChange('')

      expect(form.$hasErrors.getState()).toBeTruthy()
      expect(form.$errors.getState()).not.toMatchObject({
        errors: {},
      })
    })
  })

  describe('events', () => {
    it('on touched', () => {
      const login = createControl({ defaultValue: '' })
      const passwd = createControl({ defaultValue: '' })

      const form = createForm({ controls: { login, passwd } })

      expect(form.$touchedControls.getState()).toMatchObject({})

      login.onBlur()

      expect(form.$touchedControls.getState()).toMatchObject({
        login: true,
      })
    })

    it('reset onTouched state', () => {
      const login = createControl({ defaultValue: '' })
      const passwd = createControl({ defaultValue: '' })

      const form = createForm({ controls: { login, passwd } })

      login.onBlur()

      expect(form.$touchedControls.getState()).toMatchObject({
        login: true,
      })

      form.restore()

      expect(form.$touchedControls.getState()).toMatchObject({})
    })
  })
})
