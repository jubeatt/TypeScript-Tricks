import { Button, Col, Form, Input, Row, Select } from 'antd'
import { FormInstance, useForm } from 'antd/es/form/Form'
import { FormData } from '../../types'

type FormComponentProps = {
  initialData: FormData
  buttonPosition: 'top' | 'bottom'
  submitButtonText: string
  showCancelButton: boolean
  onSubmit: (values: FormData, form: FormInstance<FormData>) => void
  onCancel: () => void
}

const FormComponent = (props: FormComponentProps) => {
  //// props
  const { onSubmit, onCancel, initialData, buttonPosition, submitButtonText, showCancelButton } =
    props

  //// states
  const [form] = useForm()

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
          <Form.Item
            className='no-margin'
            name='title'
            label='Title'
            rules={[
              {
                required: true,
                message: 'Title cannot be blank.'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={8}>
          <Form.Item className='no-margin' name='rate' label='Rate'>
            <Select
              className='w-full'
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
                { label: '5', value: 5 }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            className='no-margin'
            name='description'
            label='Description'
            rules={[
              {
                required: true,
                message: 'Description cannot be blank.'
              }
            ]}
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
