import { z } from 'zod'

import { ControlError } from '../../types'

const parseErrorSchema = (zodErrors: z.ZodIssue[]) => {
  const errors: Record<string, ControlError> = {}

  while (zodErrors.length > 0) {
    const error = zodErrors[0]
    const { code, message, path } = error
    const _path = path.length > 0 ? path.join('.') : 'field'

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!errors[_path]) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0]

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        }
      } else {
        errors[_path] = { message, type: code }
      }
    }

    if ('unionErrors' in error) {
      error.unionErrors.forEach((unionError) => unionError.errors.forEach((e) => zodErrors.push(e)))
    }

    zodErrors.shift()
  }

  return errors
}

export const zodResolver =
  <Schema extends z.Schema<any, any>, Value>(schema: Schema, schemaOptions?: z.ParseParams) =>
  (value: Value) => {
    try {
      schema.parse(value, schemaOptions)

      return {
        errors: {},
      }
    } catch (error: any) {
      return {
        errors: error.isEmpty ? {} : parseErrorSchema(error.errors),
      }
    }
  }
