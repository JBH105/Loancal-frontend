import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';
import NewLoanForm from "./NewLoanForm";
import NewPaymentForm from "./NewPaymentForm";

function NewRecord({setAddData}:any) {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*");
    const [selectedLoan, setSelectedLoan] = useState("");
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue);
    };
    const [formData, setFormData] = useState({
        name: "",
        maturitydate: "",
        issueDate: new Date().toISOString().split('T')[0],
        interestRate: "",
        paymentFrequency: 'Monthly',
        loanAmount: "",
        activeStatus: 'true',
        firstPayment: "",
        firstPaymentDate: "",
        recordType: 'Loan',
        paymentDueDate:"",
        paymentDue: "" ,
        newOrExisting: "New",
        interestAmount: undefined,
        interestType: undefined,
        maturityType: undefined,
        maturityPeriod: undefined,
        loanLength: undefined,
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        console.log(formData)

    };

    function handleLoanSelect(selectedValue: any) {
        setSelectedLoan(selectedValue);
    }

    return (
        <div>


            <div className="container2">

                <h1 className="title">{formData.recordType === "Loan" ? "New Loan" : "New Payment"}</h1>
                <div className="type">
                    <label htmlFor="recordType">Loan or Payment </label>
                    <select
                        id="recordType"
                        name="recordType"
                        value={formData.recordType}
                        onChange={handleChange}
                        required
                    >
                        <option value="Loan">Loan</option>
                        <option value="Payment">Payment</option>


                    </select>
                </div>

                {formData.recordType === "Loan" &&(
                    <NewLoanForm setAddData={setAddData}/>
                )

                }

                {formData.recordType === "Payment" &&(
                    <NewPaymentForm setAddData={setAddData}/>
                )

                }


            </div>
        </div>
);
}

export default NewRecord;
