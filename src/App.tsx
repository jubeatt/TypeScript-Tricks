import { useRef, useState } from 'react'
import { Layout, Button, List, message } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { produce } from 'immer'
import StarIcon from '@ant-design/icons/StarFilled'
import TrashIcon from '@ant-design/icons/DeleteFilled'
import EyeIcon from '@ant-design/icons/EyeFilled'
import ModalDetail from './components/ModalDetail'
import FormComponent from './components/FormComponent/FormComponent'
import { DEFAULT_DATA } from './contsants'
import { FormData } from './types'

function App() {
  //// refs
  const formInitialValue = useRef({
    title: '',
    description: '',
    rate: 3
  })

  //// states
  const [messageApi, messageContext] = message.useMessage()
  const [listData, setListData] = useState<FormData[]>(DEFAULT_DATA)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalDataIndex, setModalDataIndex] = useState<number | null>(null)

  //// handlers
  function handleSubmit(values: FormData, form: FormInstance<FormData>): void {
    form.resetFields()
    const newListData = produce(listData, (draft) => {
      draft.push({ ...values })
    })
    setListData(newListData)
    messageApi.open({
      type: 'success',
      content: 'Add Skill Successfully.'
    })
  }

  function handleTrashIcon(toBeRemoveIndex: number): void {
    const newListData = produce(listData, (draft) => {
      draft.splice(toBeRemoveIndex, 1)
    })
    setListData(newListData)
  }

  function handleEyeIcon(selectedIndex: number): void {
    setModalDataIndex(selectedIndex)
    toggleModalVisible()
  }

  function handleModalSave(values: FormData) {
    const newListData = produce(listData, (draft) => {
      if (modalDataIndex !== null) {
        draft[modalDataIndex] = values
      }
    })
    setListData(newListData)
    toggleModalVisible()
    messageApi.open({
      type: 'success',
      content: 'Update Skill Successfully.'
    })
  }

  function toggleModalVisible(): void {
    setModalVisible((oldState) => !oldState)
  }

  //// computed
  const MAX_TEXT = 100
  const modalData = modalDataIndex !== null ? listData[modalDataIndex] : null

  return (
    <>
      {messageContext}
      <Layout.Content className='layout-wrapper'>
        <h1 className='text-center font-weight-normal'>The Tricks of TypeScript.</h1>
        <div className='mb-30'>
          <FormComponent
            buttonPosition='top'
            submitButtonText='Add'
            showCancelButton={false}
            initialData={formInitialValue.current}
            onSubmit={handleSubmit}
            onCancel={() => undefined}
          />
        </div>

        {/* 查看 List 可傳入的 props */}
        <List size='small' itemLayout='vertical'>
          {listData.map((data, index) => (
            <List.Item
              key={index}
              extra={
                <div className='flex h-full items-end'>
                  {/* 查看 Button 的 type 可傳入的選項 */}
                  <Button type='text' key='btn-delete' onClick={() => handleTrashIcon(index)}>
                    <TrashIcon style={{ fontSize: 24 }} />
                  </Button>
                  <Button type='text' key='btn-view' onClick={() => handleEyeIcon(index)}>
                    <EyeIcon style={{ fontSize: 24 }} />
                  </Button>
                </div>
              }
            >
              <div className='mb-5'>
                {Array(data.rate)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <span key={index} className={index !== 0 ? 'ml-5' : ''}>
                        <StarIcon style={{ color: '#ff9300', fontSize: 16 }} />
                      </span>
                    )
                  })}
              </div>
              <h3 className='no-margin'>{data.title}</h3>
              <p>{data.description.slice(0, MAX_TEXT) + '...'}</p>
            </List.Item>
          ))}
        </List>
      </Layout.Content>
      <ModalDetail
        data={modalData}
        visible={modalVisible}
        toggleModalVisible={toggleModalVisible}
        onSave={handleModalSave}
      />
    </>
  )
}

export default App
