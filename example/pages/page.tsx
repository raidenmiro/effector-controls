import { createErrorView, createViewControl } from '@efform/core'
import { useUnit } from 'effector-react'

import { email, formSubmitted } from './model'

const Password = createViewControl({
  control: email,
  view: ({ register }) => {
    return <input {...register} />
  },
})

const PasswordError = createErrorView({
  control: email,
  render: () => {
    return <div>oh snap!</div>
  },
})

export const Login = () => {
  const submit = useUnit(formSubmitted)

  return (
    <form onSubmit={submit}>
      <div>
        <Password />
        <PasswordError />
      </div>
      <button>submit me</button>
    </form>
  )
}
