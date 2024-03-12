import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BaseURL from '../BaseURL';

function UserInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ClientId = queryParams.get('ClientId');
    const [userInfo, setUserInfo] = useState({
        ClientName: "",
        LoanId: "LX-",
        LoanAmount: 0,
        PrincipalRemaining: 0,
        ActiveStatus: 0,
        LoanLength: 0,
        PaymentFrequency: "",
        InterestAmount: 0,
        PaymentDueAmount: 0,
        PaymentRecAmount: null,
        PaidStatus: 0,
        PrincipalPaymentRec: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const apiUrl = `${BaseURL}/api/filter-data`;
            const payload = {
                ActiveStatus: "both",
                ClientId: ClientId,
                Months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                TdyDate: "2024-03-09",
                TdyToggle: false,
                Years: [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034]
            };
    
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                // Assuming the response data structure is similar to userInfo
                setUserInfo(data); // Update userInfo based on response
            } catch (error) {
                console.error("Failed to fetch data: ", error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        if (ClientId) {
            fetchData();
        }
    }, [ClientId]);
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userInfo) return <div>No user info available</div>;

    function HomePagenav() {
        navigate('/')
    }

    return (
        <div>
        <div className="sharkcage">
        


            <div className="container4">
                <button onClick={HomePagenav}>Cancel</button>
                <h1>USER INFO</h1>

                <div className="payment-record">
                    <span className="record-field record-label">Name:</span>
                    <span className="record-field record-date">{userInfo.ClientName != null ? userInfo.ClientName : "Example"}</span>

                    <span className="record-field record-label">Total Interest Paid</span>
                    <span className="record-field record-amount">{userInfo.PaymentRecAmount != null ? userInfo.PaymentRecAmount : 0}</span>

                    <span className="record-field record-label">Total Interest Due</span>
                    <span className="record-field record-notes">{userInfo.PaymentDueAmount != null ? userInfo.PaymentDueAmount : 0}</span>

                    <span className="record-field record-label">Total Principal Paid</span>
                    <span className="record-field record-notes">{userInfo.PrincipalPaymentRec != null ? userInfo.PrincipalPaymentRec : 0}</span>

                    <span className="record-field record-label">Total Principal Due</span>
                    <span className="record-field record-notes">{userInfo.PrincipalRemaining != null ? userInfo.PrincipalRemaining : 0}</span>

                    <span className="record-field record-label">Current Loans</span>
                    <span className="record-field record-notes">{userInfo.LoanId != null ? userInfo.LoanId : "LX-"}</span>

                </div>

            </div>
        </div>
        </div>
    );
}

export default UserInfo;
