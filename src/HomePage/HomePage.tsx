import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import HomeGrid from "./HomeGrid";

import ClientDropdown from './ClientDropdown';
import Filter from '../components/Filter';
import { Modal } from 'antd';
import NewRecord from '../NewRecordPage/NewRecord';
const years = [{ name: "All", value: "" }, { name: "2024", value: 2024 }, { name: "2025", value: 2025 }, { name: "2026", value: 2026 }, { name: "2027", value: 2027 }, { name: "2028", value: 2028 }, { name: "2029", value: 2029 }, { name: "2030", value: 2030 }, { name: "2031", value: 2031 }, { name: "2032", value: 2032 }, { name: "2033", value: 2033 }, { name: "2034", value: 2034 }];
const months = [{ name: "All", value: "" }, { name: "January", value: 1 }, { name: "February", value: 2 }, { name: "March", value: 3 }, { name: "April", value: 4 }, { name: "May", value: 5 }, { name: "June", value: 6 }, { name: "July", value: 7 }, { name: "August", value: 8 }, { name: "September", value: 9 }, { name: "October", value: 10 }, { name: "November", value: 11 }, { name: "December", value: 12 }];
const statuss = [{ name: "All", value: "both" }, { name: "Open", value: "closed" }, { name: "Closed", value: "open" }];
const day = [{ name: "All", value: 'false' }, { name: "Today", value: "true" }];

function HomePage() {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*"); 
    const [selectedMonths, setSelectedMonths] = useState('');
    const [selectedYears, setSelectedYears] = useState('');

    const [selectedstatuss, setSelectedstatuss] = useState('');
    const [allToggle, setAllToggle] = useState(true)
    const [tdyToggle, setTdyToggle] = useState(false)
    const [days, setDays] = useState(false)
    const [addData, setAddData] = useState(false)

    const NewRecordnav = () => {
        setAddData(true)
    };
    const UpcomingPaymentsNav = () => {
        navigate('/UpcomingPayments');
    };

    const HelpNav = () => {
        navigate('/Help');
    };

    // Function to handle the selection change in the ClientDropdown
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };
    useEffect(() => {
    }, [allToggle]);

    const unsetTdyToggle = () => {
        setTdyToggle(false);
    };

    return (
        <div>
            <div className="container">
            <div className='text-center'>
                <div className="main-title">
                    <i className="far fa-calendar-alt"></i>
                   LMS - Loan Management System
                </div>
            </div>

            <div className="New_loan_btn">
                <button className={'newrecordbutton'} onClick={NewRecordnav}>
                    <i className="fas fa-hand-holding-usd"></i>
                    New Loan / New Payment
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: "space-between", padding: "10px 0    " }}>
                <div>
                <label htmlFor="day">Client Name:</label>
                <ClientDropdown onSelectClient={handleClientSelection} />
                </div>
                <div style={{ display: "flex", justifyContent: "end", padding: "5px", gap: "15px" }}>
                    <div>
                        <label htmlFor="day">Days:</label>
                        <Filter
                            option={day}
                            setSelectedFilter={setDays}
                            selectedFilter={days}
                            unsetTdyToggle={unsetTdyToggle}
                            className="form-control"
                        />
                    </div>
                    <div>
                        <label htmlFor="day">Status:</label>
                        <Filter option={statuss}
                            setSelectedFilter={setSelectedstatuss}
                            selectedFilter={selectedstatuss}
                            unsetTdyToggle={unsetTdyToggle} />
                    </div>
                    <div>
                        <label htmlFor="day">Months:</label>
                        <Filter
                            option={months}
                            setSelectedFilter={setSelectedMonths}
                            selectedFilter={selectedMonths}
                            unsetTdyToggle={unsetTdyToggle} />
                    </div>
                    <div>
                        <label htmlFor="day">Years:</label>
                        <Filter
                            option={years}
                            setSelectedFilter={setSelectedYears}
                            selectedFilter={selectedYears}
                            unsetTdyToggle={unsetTdyToggle} />
                    </div>
                </div>
            </div>
            </div>
            <div className="recordContainer">
                <HomeGrid
                    addData={addData} setAddData={setAddData}
                    selectedClient={selectedClient} selectedMonths={selectedMonths}
                    selectedYears={selectedYears} selectedStatus={selectedstatuss}
                    tdyToggle={tdyToggle} days={days} />
            </div>

            <Modal
                footer={null}
                open={addData} onCancel={() => setAddData(false)}>
                <NewRecord setAddData={setAddData} />
            </Modal>
        </div>
    );
}

export default HomePage;
