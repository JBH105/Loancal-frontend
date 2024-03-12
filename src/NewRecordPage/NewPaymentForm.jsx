import React, { useState } from "react";
import "../HomePage/HomePage.css";
import { useNavigate } from "react-router-dom";
import ClientDropdown from "../HomePage/ClientDropdown";
import LoanDropdown from "../HomePage/LoanDropdown";
import BaseURL from "../BaseURL";

function NewPaymentForm({ setAddData }) {
  const navigate = useNavigate();

  // This function is responsible for navigation
  const HomePagenav = () => {
    navigate("/");
  };
  const [selectedClient, setSelectedClient] = useState("*");
  const [selectedLoan, setSelectedLoan] = useState("");
  const handleClientSelection = (selectedValue) => {
    setSelectedClient(selectedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      ClientId: selectedValue,
    }));
  };

  function getNewYorkDateISO() {
    const now = new Date();
    const localTimeOffset = now.getTimezoneOffset() * 60000;
    const newYorkOffset = -300 * 60000; // Adjust for EST; consider daylight saving time as well
    const newYorkDate = new Date(
      now.getTime() - localTimeOffset + newYorkOffset
    );
    return newYorkDate.toISOString().split("T")[0];
  }

  const [formData, setFormData] = useState({
    LoanId: selectedLoan,
    ClientId: selectedClient,
    PaymentDueDate: getNewYorkDateISO(),
    PaymentDueAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const apiEndpoint = `${BaseURL}/api/new-payment`;

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(formData), 
      });
      if (response.status === 200) {
        setAddData(false);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the server responds with JSON data
      console.log(result); // Process your result here
      navigate("/");

      // Handle success, e.g., show a success message, redirect, etc.
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, e.g., show an error message
    }
  };

  function handleLoanSelect(selectedValue) {
    setSelectedLoan(selectedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      LoanId: selectedValue,
    }));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className=" form-outer">
          <div className="form-group">
            <label>Client Name</label>
            <ClientDropdown onSelectClient={handleClientSelection} />
          </div>

          <div className="form-group">
            <label>LoanID</label>
            <LoanDropdown
              onSelectLoan={handleLoanSelect}
              clientId={selectedClient}
            />
          </div>

          <div className="form-group">
            <label htmlFor="PaymentDueDate">Payment Due Date </label>
            <input
              type="date"
              id="PaymentDueDate"
              name="PaymentDueDate"
              value={formData.PaymentDueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="PaymentDueAmount">Amount Due </label>
            <input
              type="number"
              id="PaymentDueAmount"
              name="PaymentDueAmount"
              value={formData.PaymentDueAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Intrest Payment Reacived Date </label>
            <input
              type="date"
              id="PaymentRecDate"
              name="PaymentRecDate"
              value={formData.PaymentRecDate || getNewYorkDateISO()}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className="submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewPaymentForm;
