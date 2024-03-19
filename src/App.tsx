import React from 'react';
// import './App.css';
// import './HomePage/HomePage.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage/HomePage'; // import your components
import NewRecord from './NewRecordPage/NewRecord';
import UpcomingPayments from './UpcomingPaymentsPage/UpcomingPayments'
import RecordInfo from './RecordInfoPage/RecordInfo';
import ClosePaymentModal from "./HomePage/ClosePaymentModal";
import LoanInfo from './LoanInfo/LoanInfo';
import UserInfo from './UserInfo/UserInfo';
import Login from './Login';

const PrivateRoute = ({ children }:any) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute>
          <HomePage />
        </PrivateRoute>} />
        <Route path="/NewRecord" element={<NewRecord />} />
        <Route path="/RecordInfo" element={<RecordInfo />} />
        <Route path="/UpcomingPayments" element={<UpcomingPayments />} />
        <Route path="/LoanInfo" element={<LoanInfo />} />
        <Route path="/UserInfo" element={<UserInfo />} />


        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;

