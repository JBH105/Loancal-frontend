import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import {useLocation, useNavigate} from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';
import BaseURL from '../BaseURL';

function LoanInfo() {
    const location = useLocation(); // Use useParams hook here
    const queryParams = new URLSearchParams(location.search);
    const loanId = queryParams.get('LoanId');// Access loanId from params
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    const [selectedClient, setSelectedClient] = useState("*");
    const [selectedLoan, setSelectedLoan] = useState("");
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };
    const [formData, setFormData] = useState({
        name: "",
        maturitydate: "",
        issuedate: "",
        interestRate: "",
        paymentFrequency: 'Monthly',
        loanAmount: "",
        activeStatus: 'true',
        firstPayment: "",
        firstPaymentDate: "",
        recordType: 'Loan',
        paymentDueDate:"",
        paymentDue: "" ,
        newOrExisting: "New"
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(formData.recordType === "Loan"){
            if(formData.newOrExisting === "New"){
                try {

                    // Construct the API URL
                    const apiUrl = `${BaseURL}/api/new-client`;

                    // Prepare the request body
                    let requestBody = {
                        ClientName: formData.name
                    };

                    // Make the POST request
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    else{
                        let clientid = await response.json()
                        clientid = clientid.client_id
                        let loanBody:any = {
                            ClientId: clientid,
                            PaymentFrequency: formData.paymentFrequency,
                            LoanMaturity: formData.maturitydate,
                            LoanAmount: formData.loanAmount,
                            InterestRate: formData.interestRate || null,
                            ActiveStatus: formData.activeStatus,
                            IssueDate: formData.issuedate,

                        }
                        if(formData.paymentFrequency === "Manual"){
                            loanBody = {...loanBody,
                                FirstPaymentDueDate: formData.firstPaymentDate,
                                FirstPaymentDueAmount: formData.firstPayment,}
                        }
                        const apiLoanURL = `${BaseURL}/api/new-loan`;
                        const loanres = await fetch(apiLoanURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loanBody)
                        });
                        if (!loanres.ok) {
                            throw new Error(`HTTP error! Status: ${loanres.status}`);
                        }
                        else{
                            navigate(`/`);
                        }
                    }

                } catch (error) {
                    console.error('Error fetching data:', error);
                    // Consider setting an error state and displaying it in the UI
                }
            }
            else if(formData.newOrExisting === "Existing"){
                let loanBody:any = {
                    ClientId: selectedClient,
                    PaymentFrequency: formData.paymentFrequency,
                    LoanMaturity: formData.maturitydate,
                    LoanAmount: formData.loanAmount,
                    InterestRate: formData.interestRate || null,
                    ActiveStatus: formData.activeStatus,
                    IssueDate: formData.issuedate,

                }
                if(formData.paymentFrequency === "Manual"){
                    loanBody = {...loanBody,
                        FirstPaymentDueDate: formData.firstPaymentDate,
                        FirstPaymentDueAmount: formData.firstPayment,}
                }
                const apiLoanURL = `${BaseURL}/api/new-loan`;
                const loanres = await fetch(apiLoanURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loanBody)
                });
                if (!loanres.ok) {
                    throw new Error(`HTTP error! Status: ${loanres.status}`);
                }
                else{
                    navigate(`/`);
                }
            }
            }
        else if(formData.recordType === "Payment"){
            let paymentBody:any = {
                LoanId: selectedLoan,
                PaymentDueDate: formData.paymentDueDate,
                PaymentDueAmount: formData.paymentDue,
            }
            const apiLoanURL = `${BaseURL}/api/new-payment`;
            const payres = await fetch(apiLoanURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentBody)
            });
            if (!payres.ok) {
                throw new Error(`HTTP error! Status: ${payres.status}`);
            }
            else{
                navigate(`/`);
            }

        }

        
    };

    function handleLoanSelect(selectedValue: any) {
        setSelectedLoan(selectedValue);
    }

    return (
        <div>
        <div className="sharkcage">



            <div className="container3">
                <button onClick={HomePagenav}>Cancel</button>

                <h1 className="title">{formData.recordType === "Loan" ? "Existing Loan" : "New Payment"}</h1>





                <form onSubmit={handleSubmit}>


                    {
                        formData.recordType === "Loan" && formData.newOrExisting === "New" && (
                            <div className="form-group">
                                <label htmlFor="name">Name (Autofilled) </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder=""
                                    name="name"
                                    value={formData.name}
                                   
                                    required
                                />
                            </div>

                        )}

                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="date">Loan Issue Date </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="issuedate"
                                    value={formData.issuedate}
                                    
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="date">Loan Maturity Date </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="maturitydate"
                                    value={formData.maturitydate}
                                   
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="loanAmount">Initial Principle </label>
                                <input
                                    type="number"
                                    id="loanAmount"
                                    placeholder=""
                                    name="loanAmount"
                                    value={formData.loanAmount}
                                    
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="paymentFrequency">Payment Frequency </label>
                                <select
                                    id="paymentFrequency"
                                    name="paymentFrequency"
                                    value={formData.paymentFrequency}
                                
                                    required
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Weekly">Weekly</option>
                                    
                                    

                                </select>
                            </div>
                        )
                    }


               


                    


                   


                    {/* <button type="submit">Submit Changes</button> */}
                </form>

            </div>
            <div className='container3'>
                <h2>Current Principle Balance</h2>
                <h3>$1290 Dollars</h3>
                <h2>Current Interest Balance</h2>
                <h3>$220 Dollars</h3>
                <h2> Principle Paid</h2>
                <h3>$310 Dollars</h3>
                <h2> Interest Paid</h2>
                <h3>$50 Dollars</h3>
            </div>

            </div>





        </div>
    );
}

export default LoanInfo;
