import React from 'react';
import Modal from 'react-modal'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
function NewLoanModal({ isOpen, onConfirm, onCancel }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            style={customStyles}
            contentLabel="Confirmation Modal"
        >
            <h2>New Loan Created Successfully</h2>
            <button onClick={onConfirm}>Done</button>
            
        </Modal>
    );
}
export default NewLoanModal;