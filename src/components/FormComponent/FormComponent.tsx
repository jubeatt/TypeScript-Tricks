import { Button, Col, Form, Input, Row, Select } from 'antd'
import { FormInstance, useForm } from 'antd/es/form/Form'
import { FormData } from '../../types'
import { rules } from './rules'
import { starsOption } from '../../contsants'

type FormComponentProps = {
  initialData: FormData
  buttonPosition?: 'top' | 'bottom'
  submitButtonText?: string
  showCancelButton?: boolean
  onSubmit: (values: FormData, form: FormInstance<FormData>) => void
  onCancel?: () => void
}

const FormComponent = (props: FormComponentProps) => {
  //// props
  const {
    onSubmit,
    onCancel = () => undefined,
    initialData,
    buttonPosition = 'top',
    submitButtonText = 'Add',
    showCancelButton = false
  } = props

  //// states
  const [form] = useForm<FormData>()

  //// handlers
  function handleSubmit(values: FormData, form: FormInstance<FormData>) {
    onSubmit(values, form)
  }

  return (
    <Form
      initialValues={initialData}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={(values) => handleSubmit(values, form)}
      validateTrigger={['onBlur', 'onChange']}
      form={form}
    >
      {buttonPosition === 'top' && (
        <Row className='mb-10' gutter={[10, 10]}>
          {showCancelButton && (
            <Col span={24} sm={{ span: 4, offset: 16 }}>
              <Button key='btn-cancel-top' className='w-full' onClick={onCancel}>
                Cancel
              </Button>
            </Col>
          )}
          <Col span={24} sm={{ span: 4, offset: showCancelButton ? 0 : 20 }}>
            <Button key='btn-submit-top' htmlType='submit' type='primary' className='w-full'>
              {submitButtonText}
            </Button>
          </Col>
        </Row>
      )}
      <Row gutter={[10, 10]}>
        <Col span={24} sm={16}>
          <Form.Item className='no-margin' name='title' label='Title' rules={rules.title}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={8}>
          <Form.Item className='no-margin' name='rate' label='Rate'>
            <Select className='w-full' options={starsOption} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            className='no-margin'
            name='description'
            label='Description'
            rules={rules.description}
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      {buttonPosition === 'bottom' && (
        <Row className='mt-30' gutter={[10, 10]}>
          {showCancelButton && (
            <Col span={24} sm={{ span: 4, offset: 16 }}>
              <Button key='btn-cancel-bottom' className='w-full' onClick={onCancel}>
                Cancel
              </Button>
            </Col>
          )}
          <Col span={24} sm={{ span: 4, offset: showCancelButton ? 0 : 20 }}>
            <Button key='btn-submit-bottom' htmlType='submit' type='primary' className='w-full'>
              {submitButtonText}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  )
}

export default FormComponent
