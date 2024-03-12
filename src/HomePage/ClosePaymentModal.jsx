import React, {useState} from 'react';
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
// In ClosePaymentModal component

function ClosePaymentModal({ isOpen, onConfirm, onCancel }) {
    // State to hold the input value
    const [nextInterestPayment, setNextInterestPayment] = useState(null);

    // Handler to update state on input change
    const handleInputChange = (e) => {
        setNextInterestPayment(e.target.value);
    };

    // Modified onConfirm to pass the input value
    const handleConfirm = () => {
        onConfirm(nextInterestPayment); // Pass the input value on confirm
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            style={customStyles}
            contentLabel="Confirmation Modal"
        >
            <h2>Close Payment</h2>
            <h5>Next Payment Amount</h5>
            <input
                type="number"
                id="NextInterestPayment"
                placeholder=""
                name="NextInterestPayment"
                value={nextInterestPayment}
                onChange={handleInputChange}
            />

            <div className="button-container">
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </Modal>
    );
}

export default ClosePaymentModal;