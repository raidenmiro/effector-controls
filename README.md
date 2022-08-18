# Effector-controls

## Library for effector and react

### Create fields and compose to form

```tsx
const email = createControl({
  defaultValue: ''
})

const password = createControl<string>({
  defaultValue: '',
})

const schema = z.object({ ... })

// combine controls into a single form
const form = createForm({
 controls: { email, password }
 resolver: zodResolver(schema)
})
```

### Bind control for view

```tsx
const Password = createViewControl({
  bind: password,
  view: ({register}) => <Input {...register('password')} />,
 })

const Email = createViewControl({
  view: Input,
  bind: email,
 })
```

### Create custom error message component

```tsx
const EmailError = createErrorView({
  control: email,
  render: ({ failure }) => <div>{failure.message}</div>,
})
```

### Example

- model

```tsx
const email = createControl<string>({ defaultValue: '' })

const password = createControl<string>({ defaultValue: '' })

const repeatPassword = createControl<string>({ defaultValue: '' })

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  repeatPassword: z.string(),
}).refine((field) => field.password === field.repeatPassword, {
  path: ['repeatPassword']
})

const form = createForm({
  controls: { email, password, repeatPassword },
  resolver: zodResolver(schema)
})
```

- page

```tsx
// bind control to view
const Password = createViewControl({ view: InputBase, bind: password })

const Email = createViewControl({ view: InputBase, bind: email })

// create view error message
const EmailError = createErrorView({
  control: email,
  when: formSubmitted,
  render: ({ failure }) => <BaseError failure={failure.message} />,
})

const PasswordError = createErrorView({
  control: password,
  render: ({ failure }) => <BaseError failure={failure.message} />,
})

// event for starting model
const formSubmitted = createEvent<React.FormEvent>()

sample({ 
  // event to report that the form is submitted 
  clock: formSubmitted,
  // This contains the form's state with all the fields
  source: form.$values, 
  // If the form is not correct, we do not send it further
  filter: form.$valid, 
  // Optional, transform your form
  fn: ({ email. password }) => ({ email, password }),
  // Send a request with form
  target: someRequestFx
})

// page with form
export const LoginPage = () => {
  const { submit } = useUnit({ submit: formSubmitted })
  return (
    <section>
      <form onSubmit={formSubmitted}>
        <Email placeholder="email" />
        <EmailError />
        <Space h={0,4} />
        <Password placeholder="password"/>
        <PasswordError />
        <Space h={0,5} />
        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
};

formSubmitted.watch((evt) => evt.preventDefault())
```
