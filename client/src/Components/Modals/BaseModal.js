import React from 'react'
import '../../Styles/modals.css'

const BaseModal = ({title,close,children}) => {
  return (
    <div className='modal_container'>
        
        <div className='modal'>
            

        <h1>{title}</h1>
        
            <div  onClick={close} className='close-modal'>X</div>
        {children}
        
        </div>

    </div>
  )
}

export default BaseModal