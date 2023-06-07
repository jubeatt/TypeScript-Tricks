import { FormData } from '../../types'
import { Rule } from 'antd/es/form'

//// utils
type allFormKeys = keyof FormData & string
type theKeysWeNeed = Exclude<allFormKeys, 'rate'>

//// types
type RulesType = {
  [key in theKeysWeNeed]: Rule[]
}

//// variable
export const rules: RulesType = {
  title: [
    {
      required: true,
      message: 'Title cannot be blank.'
    }
  ],
  description: [
    {
      required: true,
      message: 'Description cannot be blank.'
    }
  ]
}
