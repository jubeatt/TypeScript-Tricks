import { ModalData } from './type'
import StarIcon from '@ant-design/icons/StarFilled'
import EditIcon from '@ant-design/icons/EditFilled'
import { Button } from 'antd'

type ModalContentProps = {
  data: ModalData
  onEditIconClick: () => void
}

const ModalContent = (props: ModalContentProps) => {
  //// states
  const { data, onEditIconClick } = props

  //// handler
  function handleEditIcon(): void {
    onEditIconClick()
  }

  return (
    <>
      <div className='text-right mb-10'>
        <Button type='text' onClick={handleEditIcon}>
          <EditIcon style={{ fontSize: 26 }} />
        </Button>
      </div>
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

      <p>{data.description}</p>
    </>
  )
}

export default ModalContent
