import React from "react";
import { useTranslation } from "react-i18next";
import './dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();

  const recentBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', date: '2025-05-10' },
    { id: 2, title: '1984', author: 'George Orwell', date: '2025-05-08' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', date: '2025-05-07' },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">{t('dashboardTitle')}</h2>

      <div className="stats-cards">
        <div className="card stat-card">
          <h5>{t('totalBooks')}</h5>
          <p>1234</p>
        </div>

        <div className="card stat-card">
          <h5>{t('borrowedBooks')}</h5>
          <p>120</p>
        </div>

        <div className="card stat-card">
          <h5>{t('soldBooks')}</h5>
          <p>87</p>
        </div>

        <div className="card stat-card">
          <h5>{t('readInsideLibrary')}</h5>
          <p>53</p>
        </div>

        <div className="card stat-card">
          <h5>{t('customersServed')}</h5>
          <p>305</p>
        </div>

        <div className="card stat-card">
          <h5>{t('monthlyIncome')}</h5>
          <p>$1,250</p>
        </div>
      </div>

      <div className="recent-section mt-5">
        <h4>{t('recentlyAddedBooks')}</h4>
        <table className="recent-table">
          <thead>
            <tr>
              <th>{t('title')}</th>
              <th>{t('author')}</th>
              <th>{t('dateAdded')}</th>
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
