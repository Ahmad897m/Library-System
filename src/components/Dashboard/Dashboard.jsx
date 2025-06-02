import React from "react";
import './dashboard.css';

const Dashboard = () => {
  const recentBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', date: '2025-05-10' },
    { id: 2, title: '1984', author: 'George Orwell', date: '2025-05-08' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', date: '2025-05-07' },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Dashboard</h2>

      <div className="stats-cards">
        <div className="card stat-card">
          <h5>Total Books</h5>
          <p>1234</p>
        </div>

        <div className="card stat-card">
          <h5>Borrowed Books</h5>
          <p>120</p>
        </div>

        <div className="card stat-card">
          <h5>Sold Books</h5>
          <p>87</p>
        </div>

        <div className="card stat-card">
          <h5>Read Inside Library</h5>
          <p>53</p>
        </div>

        <div className="card stat-card">
          <h5>Customers Served</h5>
          <p>305</p>
        </div>

        <div className="card stat-card">
          <h5>Monthly Income</h5>
          <p>$1,250</p>
        </div>
      </div>

      <div className="recent-section mt-5">
        <h4>Recently Added Books</h4>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {recentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
