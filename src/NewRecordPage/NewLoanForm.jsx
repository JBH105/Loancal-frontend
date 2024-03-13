import React, { useState } from "react";
import "../HomePage/HomePage.css";
import { useNavigate } from "react-router-dom";
import ClientDropdown from "../HomePage/ClientDropdown";
import BaseURL from "../BaseURL";

function NewLoanForm({ setAddData }) {

  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState("*");

  const [selectedLoan, setSelectedLoan] = useState("");
  const handleClientSelection = (selectedValue) => {
    setSelectedClient(selectedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      ClientId: selectedValue,
    }));
  };
  const [formData, setFormData] = useState({
    InterestAmount: "",
    IssueDate: getNewYorkDateISO(),
    LoanAmount: "",
    LoanLength: "",
    Name: "",
    PaymentFrequency: "Monthly",
    Type: "New",
    ClientId: selectedClient,
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
    const apiEndpoint = `${BaseURL}/api/new-loan`;
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("response", response);
      if (response.status === 200) {
        setAddData(false);
        resetForm();
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      navigate("/");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      InterestAmount: "",
      IssueDate: getNewYorkDateISO(),
      LoanAmount: "",
      LoanLength: "",
      Name: "",
      PaymentFrequency: "Monthly",
      Type: "New",
      ClientId: selectedClient,
    });
  };


  function handleLoanSelect(selectedValue) {
    setSelectedLoan(selectedValue);
  }

  function getNewYorkDateISO() {
    const now = new Date();
    const localTimeOffset = now.getTimezoneOffset() * 60000;
    const newYorkOffset = -300 * 60000;
    const newYorkDate = new Date(
      now.getTime() - localTimeOffset + newYorkOffset
    );
    return newYorkDate.toISOString().split("T")[0];
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-outer">
          <div className="form-group">
            <label htmlFor="Type">New or Existing Client </label>
            <select
              id="Type"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Existing">Existing</option>
            </select>
          </div>

          <div className="form-group">
            {formData.Type === "Existing" ? (
              <>
                <label htmlFor={"Name"}>Client Name</label>
                <ClientDropdown onSelectClient={handleClientSelection} />
              </>
            ) : (
              <>
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Loan Issue Date </label>
            <input
              type="date"
              id="IssueDate"
              name="IssueDate"
              value={formData.IssueDate || getNewYorkDateISO()}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="LoanAmount">Loan Amount (Principle)</label>
            <input
              type="number"
              id="LoanAmount"
              placeholder=""
              name="LoanAmount"
              value={formData.LoanAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="PaymentFrequency">
              Interest Payment Frequency
            </label>
            <select
              id="PaymentFrequency"
              name="PaymentFrequency"
              value={formData.PaymentFrequency}
              onChange={handleChange}
              required
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="LoanLength">Loan Length</label>
            <input
              type="number"
              id="LoanLength"
              placeholder=""
              name="LoanLength"
              value={formData.LoanLength}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="InterestAmount">Interest Payment Amount</label>
            <input
              type="number"
              id="InterestAmount"
              placeholder=""
              name="InterestAmount"
              value={formData.InterestAmount}
              onChange={handleChange}
              required
            />
          </div>
          {
            formData.Type === "New" ?
              (
                <>
                  <div className="form-group">
                    <label htmlFor="LoanId">Loan ID</label>
                    <input
                      type="text"
                      id="LoanId"
                      placeholder=""
                      name="LoanId"
                      value={formData.LoanId}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )
              : null
          }

        </div>
        <button className="submit" type={"submit"}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewLoanForm;
