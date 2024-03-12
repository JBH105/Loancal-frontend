import React, { useEffect, useState } from 'react';
import BaseURL from '../BaseURL';

export default function InfoModal({ id }: any) {
    console.log("🚀 ~ InfoModal ~ id:", id)
    const [userInfo, setUserInfo] = useState(
        {
            "PaymentRecAmount": null,
            "PaidStatus": 0,
            "PrincipalPaymentRec": null,
            "PrincipalRemaining": 2222.0,
            "LoanId": "LX-474379",
            "PaymentDueDate": "2024-04-06",
            "PaymentDueAmount": 222.0,
            "PaymentRecDate": "2024-03-06",
            "Notes": null,
            "PaymentId": "b1f1a5db-d2b5-4a73-a15d-8c7bd84e5342",
            "UpdateTime": null,
            "ClientId": "c3a1e69b-c0fc-47c9-8932-ceac85357399",
            "LoanAmount": 2222.0,
            "ActiveStatus": 1,
            "LoanLength": 2,
            "PaymentFrequency": "Monthly",
            "InterestAmount": 222.0,
            "IssueDate": "2024-03-06",
            "ClientName": "TestPayment"
        }
    );
    const [total, setTotal] = useState<{
        totalloanamount: number;
        totalinterestAmount: number;
        totalRemaining: number;
    }>({
        totalloanamount: 0,
        totalinterestAmount: 0,
        totalRemaining: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const payload = {
                "Months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                "Years": [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034],
                "ActiveStatus": "both",
                "ClientId": id?.ClientId,
                "TdyToggle": false,
                "TdyDate": "2024-03-09"
            };

            const apiUrl = `${BaseURL}/api/filter-data`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const resData = data.results[0];
                console.log(userInfo);

                const totalloanamount: number = data.results.reduce((total: number, item: any) => total + item.LoanAmount, 0);
                const totalinterestAmount: number = data.results.reduce((total: number, item: any) => total + item.InterestAmount, 0);
                const totalRemaining: number = data.results.filter((item:any) => item.PaidStatus !== 1).reduce((total: number, item: any) => total + item.PrincipalRemaining, 0);
                setUserInfo(resData);
                setTotal({ totalloanamount, totalinterestAmount, totalRemaining })
            } catch (error) {
                console.error("Failed to fetch data: ", error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);


    return (
        <div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>
                                User Info.
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{userInfo?.ClientName}</td>
                        </tr>
                        <tr>
                            <td>Total Loan Ammounts</td>
                            <td>{total?.totalloanamount}</td>
                        </tr>
                        <tr>
                            <td>Total Int. paid</td>
                            <td>{total.totalinterestAmount}</td>
                        </tr>
                        <tr>
                            <td>Remaining Principal</td>
                            <td>{total.totalRemaining}</td>
                        </tr>
                        <tr>
                            <td>Total Principal Paid</td>
                            <td>{userInfo?.PaidStatus}</td>
                        </tr>
                        <tr>
                            <td>Current Loans</td>
                            <td>{userInfo?.LoanId}</td>
                        </tr>
                    </tbody>
                </table>
                <table className='border'>
                    <thead>
                        <tr>
                            <th colSpan={2}>
                                Loan Info.
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Loan ID</td>
                            <td>{userInfo?.ClientName}</td>
                        </tr>
                        <tr>
                            <td>Loan Issue Date</td>
                            <td>{userInfo?.IssueDate}</td>
                        </tr>
                        <tr>
                            <td>Loan Mat Date</td>
                            <td>{userInfo?.PaymentRecDate}</td>
                        </tr>
                        <tr>
                            <td>Total Loan Amt.</td>
                            <td>{userInfo?.LoanAmount}</td>
                        </tr>
                        <tr>
                            <td>Payment Frequency</td>
                            <td>{userInfo?.PaymentFrequency}</td>
                        </tr>
                        <tr>
                            <td>Total Int. Paid</td>
                            <td>{userInfo?.PaidStatus}</td>
                        </tr>
                        <tr>
                            <td>Remaining Principal</td>
                            <td>{userInfo?.PrincipalRemaining}</td>
                        </tr>
                        <tr>
                            <td>Total Principal Paid</td>
                            <td>{userInfo?.PaidStatus}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
