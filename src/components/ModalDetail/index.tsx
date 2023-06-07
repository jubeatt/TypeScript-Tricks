import { Empty, Modal } from 'antd'
import { useEffect, useState } from 'react'
import ModalContent from './ModalContent'
import { ModalData } from './type'
import FormComponent from '../FormComponent'
import { FormData } from '../../types'

type ModalProps = {
  visible: boolean
  data: ModalData | null
  toggleModalVisible: () => void
  onSave: (values: FormData) => void
}

const DetailModal = (props: ModalProps) => {
  //// props
  const { visible, data, toggleModalVisible, onSave } = props

  //// states
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  //// handlers
  function handleSubmit(values: FormData): void {
    onSave(values)
  }

  function handleCancel(): void {
    setMode('view')
  }

  function handleEditIcon(): void {
    setMode('edit')
  }

  //// effects
  useEffect(() => {
    if (!visible) {
      setMode('view')
    }
  }, [visible])

  // if no data
  if (data === null) {
    return (
      <Modal
        width={700}
        open={visible}
        onCancel={toggleModalVisible}
        closable={false}
        footer={null}
        destroyOnClose
        centered
      >
        <Empty />
      </Modal>
    )
  }

  // render with data
  return (
    <Modal
      width={700}
      open={visible}
      onCancel={toggleModalVisible}
      closable={false}
      footer={null}
      destroyOnClose
    >
      {mode === 'edit' ? (
        <FormComponent
          buttonPosition='bottom'
          submitButtonText='Save'
          initialData={data}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          showCancelButton
        />
      ) : (
        <ModalContent data={data} onEditIconClick={handleEditIcon} />
      )}
    </Modal>
  )
}
export default DetailModal
