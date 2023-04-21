import React from 'react'

import DialogModal from './Dialog'

interface AddGameModalProps {
  type?: 'Add' | 'Edit'
  actionButton?: React.ReactNode
}

export const AddGameModal = ({
  type = 'Add',
  actionButton,
}: AddGameModalProps) => {
  const handleSave = () => {}

  return (
    <DialogModal
      title={`${type} Game`}
      button={
        actionButton || (
          <button className='btn btn-primary mr-4 mt-4'>{type} Game</button>
        )
      }
      onSave={handleSave}
    ></DialogModal>
  )
}
export default AddGameModal
