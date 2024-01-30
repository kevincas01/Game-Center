import React from 'react'
import BaseModal from './BaseModal'

const GameLostModal = ({reset}) => {
  return (
    <BaseModal title="You losttt wordle">
        <p> Try againnn</p>
        <button onClick={reset}>Reset the gamee</button>
    </BaseModal>
  )
}

export default GameLostModal