import decimal
import json
from datetime import datetime, timedelta, date
from typing import List

from dateutil.relativedelta import relativedelta
import random
import uuid
from decimal import Decimal

from databases import Database
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models import NewLoan, NewPayment, Client, Loan, Payment, UpdateLoan, FilterParams, NewClient, DeletePayment

DATABASE_NAME = "TestDB"
CLIENT_TABLE_NAME = "Client"
CLIENT_RECORDS_TABLE_NAME = "LoanRecord"
PAYMENT_TABLE_NAME = "PaymentRecord"
DATABASE_URL = "postgres://loanuser:V5iOs5Rg7Px4pofEkFtR8O8YtHh7OHaq@dpg-cnntiag21fec73ar5ak0-a/loandb_5kgl"
database = Database(DATABASE_URL)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def new_client(clientName):
    find_client_query = f"""
        SELECT * FROM {CLIENT_TABLE_NAME}
        WHERE ClientName = :ClientName
        """
    client_check = await database.fetch_one(find_client_query, {"ClientName": clientName})

        # If client not found, create a new client
    if not client_check:
       new_client_id = str(uuid.uuid4())
       create_client_query = f"""
       INSERT INTO {CLIENT_TABLE_NAME} (ClientId, ClientName)
       VALUES (:ClientId, :ClientName)
       """
       await database.execute(create_client_query,{"ClientId": new_client_id, "ClientName": clientName})
       client_id = new_client_id
       return client_id
    else:
        return client_check.ClientId

@app.get("/api/clients")
async def get_all_clients():
    query = f"SELECT * FROM {CLIENT_TABLE_NAME}"
    result = await database.fetch_all(query)
    records = [Client(**row).model_dump() for row in result]
    return JSONResponse(content={"results": records}, status_code=200)


@app.post("/api/new-loan")
async def create_new_loan(loan: NewLoan):
    # Check if LoanId is provided from frontend
    if loan.LoanId:
        record_id = loan.LoanId
        existing_record = await database.fetch_one(
            f"SELECT * FROM {CLIENT_RECORDS_TABLE_NAME} WHERE LoanId = :loan_id",
            {"loan_id": record_id}
        )
        if existing_record:
            raise HTTPException(status_code=400, detail="LoanId already exists")
    else:
        record_id = random.randint(100000, 999999)
        record_id = "LX-" + str(record_id)

    if loan.Type == "New":
        client_id = await new_client(loan.Name)
    else:
        client_id = loan.ClientId

    insert_query = f"""
        INSERT INTO {CLIENT_RECORDS_TABLE_NAME} (LoanId, ClientId, LoanAmount, ActiveStatus, LoanLength, PaymentFrequency, InterestAmount, IssueDate)
        VALUES (:record_id, :client_id, :loan_amount, :active_status, :loan_length, :payment_frequency, :interest_amount, :issue_date)
        """
    await database.execute(insert_query, {
            "record_id": record_id,
            "client_id": client_id,
            "loan_amount": loan.LoanAmount,
            "active_status": 1,
            "loan_length": loan.LoanLength,
            "payment_frequency": loan.PaymentFrequency,
            "interest_amount": loan.InterestAmount,
            "issue_date": loan.IssueDate,
        })

    if loan.PaymentFrequency == "Monthly":
        time_delta = relativedelta(months=+1)
    elif loan.PaymentFrequency == "Weekly":
        time_delta = relativedelta(weeks=+1)
    else:
        raise ValueError("Unsupported Payment Frequency")

    first_payment = NewPayment(
        LoanId=record_id,
        PaymentDueDate=loan.IssueDate + time_delta,  # Adds one month to IssueDate
        PaymentDueAmount=loan.InterestAmount,
        PrincipalRemaining=loan.LoanAmount
    )
    await create_new_payment(first_payment)
    return JSONResponse(content={"message": "New record created successfully", "LoanId": record_id}, status_code=200)




from datetime import datetime
@app.post("/api/new-payment")
async def create_new_payment(payment: NewPayment):
    payment_id = str(uuid.uuid4())
    current_date = datetime.now().date()  

    query = f"""
    INSERT INTO {PAYMENT_TABLE_NAME}
    (LoanId, PaymentDueDate, PaymentDueAmount, PaymentRecDate, PaymentRecAmount, PaymentId, PaidStatus, PrincipalPaymentRec, Notes, PrincipalRemaining)
    VALUES (:record_id, :payment_due_date, :payment_due_amount, :payment_rec_date, :payment_rec_amount, :payment_id, :paid_status, :principal_rec, :notes, :principal_remaining)
    """
    values = {
        "record_id": payment.LoanId,
        "payment_due_date": payment.PaymentDueDate,
        "payment_due_amount": payment.PaymentDueAmount,
        "payment_rec_date": payment.PaymentRecDate,
        "payment_rec_amount": None,
        "payment_id": payment_id,
        "paid_status": False,
        "principal_rec": None,
        "notes": None,
        "principal_remaining": payment.PrincipalRemaining
    }
    print("====>>>>",values)
    await database.execute(query, values)
    return {"message": "New payment created successfully", "PaymentId": payment_id}


@app.get("/api/search-by-client-id")
async def search_by_client_id(client_id: str = None):
    if client_id == "*":
        query = f"SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}"
        result = await database.fetch_all(query)
    else:
        query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE ClientId = :client_id
        """
        values = {"client_id": client_id}
        result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    ##records = [Loan(**row).model_dump() for row in result]
    return JSONResponse(content={"results": converted_rows}, status_code=200)

@app.get("/api/search-by-loan-id")
async def search_by_loan_id(loan_id: str = None):

    query = f"""
            SELECT * FROM {CLIENT_RECORDS_TABLE_NAME}
            WHERE LoanId = :loan_id
        """
    values = {"loan_id": loan_id}
    result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    return {"results": converted_rows}


@app.get("/api/search-payments-by-loan-id")
async def search_payments_by_client_id(loan_id: str = None):
    query = f"""
            SELECT * FROM {PAYMENT_TABLE_NAME}
            WHERE LoanId = :loan_id
        """
    values = {"loan_id": loan_id}
    result = await database.fetch_all(query, values=values)

    # Convert each ClientRecord object to a dictionary
    converted_rows = []
    for row in result:
        row_dict = dict(row)  # Convert row to dictionary
        converted_row = {
            key: (value.isoformat() if isinstance(value, date) else
                  float(value) if isinstance(value, Decimal) else
                  value)
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
    return JSONResponse(content={"results": converted_rows}, status_code=200)

@app.put("/api/active-status")
async def update_record(record: UpdateLoan, loan_id: str = Query(...)):
    query = f"""
    UPDATE {CLIENT_RECORDS_TABLE_NAME}
    SET ActiveStatus = :ActiveStatus
    WHERE LoanId = :loan_id
    """

    values = {
        "loan_id": loan_id,
        "ActiveStatus": record.ActiveStatus,
    }

    await database.execute(query, values)
    return JSONResponse(content={"message": "Record updated successfully"}, status_code=200)



async def get_payment_by_paymentid(payment_id: str):
    query = f"""
        SELECT * FROM {PAYMENT_TABLE_NAME}
        WHERE PaymentId = :payment_id"""
    values = {"payment_id": payment_id}
    result = await database.fetch_all(query, values=values)
    converted_rows = []
    for row in result:
        row_dict = dict(row)
        converted_row = {
            key: value
            for key, value in row_dict.items()
        }
        converted_rows.append(converted_row)
        return converted_rows[0]

@app.put("/api/update-payment-status")
async def update_payment_status(payment_id: str = Query(...), paid_status: bool = Query(...), principal_remaining = -1, new_expected_payment = None):
    record = await get_payment_by_paymentid(payment_id)
    loan = await search_by_loan_id(record["LoanId"])
    loan = loan["results"][0]
    if new_expected_payment:
        amount_due = new_expected_payment
    else:
        amount_due = loan["InterestAmount"]
    if record["PaidStatus"] == paid_status:
        return JSONResponse(content={"message": "Payment Status is already updated"}, status_code=200)
    query = f"""
        UPDATE {PAYMENT_TABLE_NAME}
        SET PaidStatus = :paid_status
        WHERE PaymentId = :payment_id
        """

    values = {
        "payment_id": payment_id,
        "paid_status": paid_status
    }

    await database.execute(query, values)
    if paid_status == False:
        return "Status Updated"
    payfreq = loan["PaymentFrequency"]
    query = f"""
            SELECT * FROM {PAYMENT_TABLE_NAME}
            WHERE LoanId = :loan_id
            """

    values = {
            "loan_id": loan["LoanId"]
        }
    result = await database.fetch_all(query, values=values)
    total_payment = len(result)
    if total_payment < loan["LoanLength"]:
        if loan["PaymentFrequency"] == "Weekly":
            new_due_date = record["PaymentDueDate"] + timedelta(days=7)
        elif loan["PaymentFrequency"] == "Monthly":
            new_due_date = record["PaymentDueDate"] + relativedelta(months=+1)
        new_payment = NewPayment(
            LoanId=loan["LoanId"],
            PaymentDueDate=new_due_date,
            PaymentDueAmount=amount_due,
            PrincipalRemaining=principal_remaining
        )
        await create_new_payment(new_payment)
    else:
        return "updated"

async def update_principal_remaining(loanid):
    # Assuming PAYMENT_TABLE_NAME and LOAN_TABLE_NAME are defined
    # and you have a database connection object `database`

    # Step 1: Fetch the sum of principal payments for the loan
    sum_query = f"""
        SELECT SUM(PrincipalPaymentRec) AS TotalPrincipalPaid
        FROM {PAYMENT_TABLE_NAME}
        WHERE LoanId = :loan_id
    """
    values = {"loan_id": loanid}
    total_princ_payments_result = await database.fetch_one(sum_query, values)

    # Extract the total payments amount, defaulting to 0 if none found
    total_principal_paid = total_princ_payments_result["TotalPrincipalPaid"] if total_princ_payments_result["TotalPrincipalPaid"] is not None else 0

    # Step 2: Update the principal remaining in another table, assuming you have such a column and table
    # This would depend on your schema. For example, you might subtract the total payments from the original loan amount
    update_query = f"""
        UPDATE {CLIENT_RECORDS_TABLE_NAME}
        SET PrincipalRemaining = (LoanAmount - :total_paid)
        WHERE LoanId = :loan_id
    """
    update_values = {"loan_id": loanid, "total_paid": total_principal_paid}
    await database.execute(update_query, update_values)

    # Optionally, return the total principal paid or any other relevant information
    return total_principal_paid



@app.put("/api/update-payment")
async def update_payment(record: Payment):
    print(record.PaymentRecDate)
    paid_status = record.PaidStatus
    payment_id = record.PaymentId
    if record.PrincipalRemaining:
        principal_remaining = record.PrincipalRemaining - record.PrinciplePaymentReceived
    else:
        principal_remaining = None
    print(record.PrincipalRemaining)
    print(record.PrinciplePaymentReceived)
    print(principal_remaining)
    print(record.NewExpectedPayment)
    test = await update_payment_status(payment_id, paid_status, principal_remaining, record.NewExpectedPayment)
    query = f"""
                    UPDATE {PAYMENT_TABLE_NAME}
                    SET PaymentRecDate = :PaymentRecDate,
                        PaymentRecAmount = :PaymentRecAmount,
                        PrincipalPaymentRec = :principal_rec,
                        Notes = :notes
                    WHERE PaymentId = :payment_id
                    """

    values = {
            "PaymentRecDate": record.PaymentRecDate,
            "PaymentRecAmount": record.PaymentRecAmount,
            "payment_id": payment_id,
            "principal_rec": record.PrinciplePaymentReceived,
            "notes": record.Notes

        }

    await database.execute(query, values)
    return JSONResponse(content={"message": "Record updated successfully"}, status_code=200)



@app.get("/api/user-info")
async def user_info(client_id: str):
    query = f"""
            SELECT
                c.ClientName,
                cr.LoanId,
                cr.LoanAmount,
                cr.ActiveStatus,
                cr.LoanLength,
                cr.PaymentFrequency,
                cr.InterestAmount,
                p.PaymentDueAmount,
                p.PaymentRecAmount,
                p.PaidStatus,
                p.PrincipalPaymentRec
            FROM
                {CLIENT_TABLE_NAME} AS c
            JOIN
                {CLIENT_RECORDS_TABLE_NAME} AS cr ON c.ClientId = cr.ClientId
            JOIN
                {PAYMENT_TABLE_NAME} AS p ON cr.LoanId = p.LoanId
            WHERE
                c.ClientId = :client_id;
            """
    values = {"client_id": client_id}
    rows = await database.fetch_all(query, values)  # Using fetch_all to get all matching records

        # Convert row objects to a list of dictionaries
    results = [dict(row) for row in rows]
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
    return {"data": results}

@app.delete("/api/delete-payment")
async def delete_payment(record: DeletePayment):
    query = f"""
                        DELETE FROM {PAYMENT_TABLE_NAME}
                        WHERE LoanId = :loan_id AND PaymentId = :payment_id
                        """
    values = {
        "loan_id": record.LoanId,
        "payment_id": record.PaymentId
    }
    await database.execute(query, values)
    return JSONResponse(content={"message": "Record deleted successfully"}, status_code=200)
async def tdy_owed(date):
    query = f"""
                    SELECT p.*, l.*, c.ClientName
                    FROM {PAYMENT_TABLE_NAME} AS p
                    JOIN {CLIENT_RECORDS_TABLE_NAME} AS l ON p.LoanId = l.LoanId
                    JOIN {CLIENT_TABLE_NAME} AS c ON l.ClientId = c.ClientId
                    WHERE p.PaymentDueDate = :date
                    """
    # Execute query
    result = await database.fetch_all(query=query, values={"date": date})
    return result

@app.post("/api/filter-data")
async def filter_data(params: FilterParams):
    if params.TdyToggle:
        result = await tdy_owed(params.TdyDate)
        return {"results":result}

    if params.ActiveStatus == "both":
        active_status = [True, False]
    elif params.ActiveStatus == "closed":
        active_status = [False]
    elif params.ActiveStatus == "open":
        active_status = [True]
    else:
        active_status = ["none"]


    month_conditions = ", ".join(str(month) for month in params.Months)
    year_conditions = ", ".join(str(year) for year in params.Years)
    if params.ClientId == "*":
        query = f"""
                    SELECT p.*, l.*, c.ClientName
                    FROM {PAYMENT_TABLE_NAME} AS p
                    JOIN {CLIENT_RECORDS_TABLE_NAME} AS l ON p.LoanId = l.LoanId
                    JOIN {CLIENT_TABLE_NAME} AS c ON l.ClientId = c.ClientId
                    WHERE MONTH(p.PaymentDueDate) IN ({month_conditions})
                    AND YEAR(p.PaymentDueDate) IN ({year_conditions})
                    AND p.PaidStatus IN :active_status
                    """

        # Execute query
        result = await database.fetch_all(query=query, values={
            "active_status": active_status
        })
    else:
        query = f"""
                    SELECT p.*, l.*, c.ClientName
                    FROM {PAYMENT_TABLE_NAME} AS p
                    JOIN {CLIENT_RECORDS_TABLE_NAME} AS l ON p.LoanId = l.LoanId
                    JOIN {CLIENT_TABLE_NAME} AS c ON l.ClientId = c.ClientId
                    WHERE MONTH(p.PaymentDueDate) IN ({month_conditions})
                    AND YEAR(p.PaymentDueDate) IN ({year_conditions})
                    AND (p.PaidStatus IN :active_status)
                    AND (l.ClientId) = :client_id
                    """

            # Execute query
        result = await database.fetch_all(query=query, values={
                    "active_status": active_status,
                    "client_id": params.ClientId
                })

    # Return result
    return {"results":result}

async def create_tables():
    query = f"""
    CREATE DATABASE IF NOT EXISTS {DATABASE_NAME};

    CREATE TABLE IF NOT EXISTS {CLIENT_TABLE_NAME} (
        ClientId VARCHAR(50) NOT NULL PRIMARY KEY,
        ClientName VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS {CLIENT_RECORDS_TABLE_NAME} (
        LoanId VARCHAR(50) NOT NULL PRIMARY KEY,
        ClientId VARCHAR(50) NOT NULL,
        LoanAmount DECIMAL(10, 2) NOT NULL,
        ActiveStatus BOOLEAN NOT NULL,
        LoanLength INT NOT NULL,
        PaymentFrequency VARCHAR(50) NOT NULL,
        InterestAmount DECIMAL(10, 2),
        IssueDate DATE NOT NULL,
        FOREIGN KEY (ClientId) REFERENCES {CLIENT_TABLE_NAME}(ClientId)
    );

    CREATE TABLE IF NOT EXISTS {PAYMENT_TABLE_NAME} (
        LoanId VARCHAR(50) NOT NULL,
        PaymentDueDate DATE NOT NULL,
        PaymentDueAmount DECIMAL(10, 2) NOT NULL,
        PaymentRecDate DATE,
        PaymentRecAmount DECIMAL(10, 2),
        PaidStatus BOOLEAN NOT NULL,
        PrincipalPaymentRec DECIMAL(10,2),
        PrincipalRemaining DECIMAL(10, 2),
        Notes MEDIUMTEXT,
        PaymentId VARCHAR(50) NOT NULL PRIMARY KEY,
        FOREIGN KEY (LoanId) REFERENCES {CLIENT_RECORDS_TABLE_NAME}(LoanId));
    """
    await database.execute(query)


@app.on_event("startup")
async def startup():
    await database.connect()
    await create_tables()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/heartbeat")
async def heartbeat():
    return JSONResponse(content={"success": True}, status_code=200)