import React, { useEffect, useState } from 'react';
import BaseURL from '../BaseURL';
import { log } from 'util';

export default function InfoModal({ id }: any) {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [total, setTotal] = useState<{
        totalloanamount: number;
        totalinterestAmount: number;
        totalRemaining: number;
        totalprincipalpaid: number;
    }>({
        totalloanamount: 0,
        totalinterestAmount: 0,
        totalRemaining: 0,
        totalprincipalpaid: 0
    });

    const [principalPaymentRecs, setPrincipalPaymentRecs] = useState<number[]>();
    const [principalRemaining, setPrincipalRemaining] = useState<number[]>();

    const [loanIds, setLoanIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const payload = {

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
                const resData = data.results;

                const totalloanamount: number = data.results.reduce((total: number, item: any) => total + item.LoanAmount, 0);
                const totalinterestAmount: number = data.results.reduce((total: number, item: any) => total + item.PaymentRecAmount, 0);
                const totalRemaining: number = data.results.filter((item: any) => item.PaidStatus !== 1).reduce((total: number, item: any) => total + item.PrincipalRemaining, 0);
                const unpaidLoanIds: string[] = resData.filter((item: any) => item.PaidStatus === 0).map((result: any) => result.LoanId);
                const totalprincipalpaid: number = data.results.filter((item: any) => item.PaidStatus == 1).reduce((total: number, item: any) => total + item.LoanAmount, 0);

                const filteredId = resData.filter((item: any) => item.LoanId === id.LoanID && item.PaidStatus == 1);
                const principalPaymentRecs: number[] = filteredId.map((item: any) => item.PrincipalPaymentRec);
                const principalRemaining: number[] = filteredId.map((item: any) => item.PrincipalRemaining);


                setPrincipalPaymentRecs(principalPaymentRecs);
                setPrincipalRemaining(principalRemaining);
                setLoanIds(unpaidLoanIds);
                setUserInfo(resData);
                console.log(totalloanamount, totalinterestAmount, totalRemaining, totalprincipalpaid );
                setTotal({ totalloanamount, totalinterestAmount, totalRemaining, totalprincipalpaid })
            } catch (error) {
                console.error("Failed to fetch data: ", error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);
    const AllLoanId = `${loanIds.join(', ')}`;




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
                            <td>{id.ClientName}</td>
                        </tr>
                        <tr>
                            <td>Total Loan Ammounts</td>
                            <td>{total?.totalloanamount}</td>
                        </tr>
                        <tr>
                            <td>Total Int. paid</td>
                            <td>{total?.totalinterestAmount}</td>
                        </tr>
                        <tr>
                            <td>Remaining Principal</td>
                            <td>{total.totalRemaining}</td>
                        </tr>
                        <tr>
                            <td>Total Principal Paid</td>
                            <td>{total.totalprincipalpaid}</td>
                        </tr>
                        <tr>
                            <td>Current Loans</td>
                            <td>{AllLoanId}</td>
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
                            <td>{id.LoanID}</td>
                        </tr>
                        <tr>
                            <td>Loan Issue Date</td>
                            <td>{id.IssueDate}</td>
                        </tr>
                        <tr>
                            <td>Loan Mat Date</td>
                            <td>{id.Due}</td>
                        </tr>
                        <tr>
                            <td>Total Loan Amt.</td>
                            <td>{id.LoanAmount}</td>
                        </tr>
                        <tr>
                            <td>Payment Frequency</td>
                            <td>{id.PaymentFrequency}</td>
                        </tr>
                        <tr>
                            <td>Interest Payment Received</td>
                            <td>{id.InterestRate}</td>
                        </tr>

                        <tr>
                            <td>Remaining Principal</td>
                            <td>   {id.remainingPrinciple}</td>
                        </tr>
                        <tr>
                            <td>Total Principal Paid</td>
                            <td>{id.Closed === true ? principalPaymentRecs : 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
