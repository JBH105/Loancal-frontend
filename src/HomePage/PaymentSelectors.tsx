import React, { useState } from 'react';

function PaymentTypeSelector() {
    const [paymentType, setPaymentType] = useState('automated'); // Default to 'automated'

    const handleChange = (event:any) => {
        setPaymentType(event.target.value);
    };

    return (
        <div className='radio'>
            <h2>Payment Type</h2>
                <label>
                    <input
                        type="radio"
                        value="automated"
                        checked={paymentType === 'automated'}
                        onChange={handleChange}
                    />
                    Automated   
                
                </label>
            
            
                <label>
                    <input
                        type="radio"
                        value="manual"
                        checked={paymentType === 'manual'}
                        onChange={handleChange}
                    />
                    Manual
                </label>
            
        </div>
    );
}

export default PaymentTypeSelector;
