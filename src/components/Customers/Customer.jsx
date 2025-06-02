import React, { useState } from "react";
import './customer.css'

const Customer = ({customersLog}) => {

    const [filter, setFilter] = useState("All")

    const filteredCustomers = 
    filter === 'All' ? customersLog : customersLog.filter((c) => c.action === filter)

    return(
        <>
            <div className="container py-4">
                      <h3>👥 Customers Log</h3>

                      <div className="btn-group mb-3 mt-3" role="group">
                        <button className={`btn btn-outline-primary ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter("All")}>All</button>
                        <button className={`btn btn-outline-secondary ${filter === 'Read' ? 'active' : ''}`} onClick={() => setFilter("Read")}>Read</button>
                        <button className={`btn btn-outline-success ${filter === 'Buy' ? 'active' : ''}`} onClick={() => setFilter("Buy")}>Purchases</button>
                        <button className={`btn btn-outline-warning ${filter === 'Borrow' ? 'active' : ''}`} onClick={() => setFilter("Borrow")}>Borrowing</button>
                      </div>

                          {filteredCustomers.length === 0 ? (
        <div className="alert alert-warning">❗ No records found.</div>
      ) : (
        <ul className="list-group">
          {filteredCustomers.map((cust) => (
            <li key={cust.id} className="list-group-item">
              <strong>{cust.name}</strong> - <em>{cust.action}</em> "<strong>{cust.bookTitle}</strong>"
            </li>
          ))}
        </ul>
      )}

      <hr className="my-4" />
      <div className="alert alert-info">
        📊 Total Transactions: <strong>{customersLog.length}</strong>
      </div>
                      
          </div>
      </>
    )
}

export default Customer