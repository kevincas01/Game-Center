import React from 'react'
import BaseModal from './BaseModal'

const GameWonModal = ({ open,closeModal, reset }) => {
  return (
    open ? (
      <BaseModal title="Perfect" close={closeModal}>
        <p>great jobbb</p>
        <button onClick={reset}>Reset the gamee</button>
      </BaseModal>
    ) : null
  );
};

export default GameWonModal