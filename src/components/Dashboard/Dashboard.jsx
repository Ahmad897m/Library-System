import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectStats, selectRecentBooks, updateStats } from '../../redux/slices/statsSlice';
import { selectTransactions } from '../../redux/slices/transactionsSlice';
import './dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectStats);
  const recentBooks = useAppSelector(selectRecentBooks);
  const transactions = useAppSelector(selectTransactions);

  useEffect(() => {
    dispatch(updateStats());
  }, [dispatch]);

  // حساب إجمالي دخل الإعارة
  const calculateBorrowIncome = () => {
    return transactions
      .filter(t => t.action === 'Borrow')
      .reduce((total, transaction) => total + (parseFloat(transaction.price) || 0), 0)
      .toFixed(2);
  };

  // حساب إجمالي دخل المبيعات
  const calculateSalesIncome = () => {
    return transactions
      .filter(t => t.action === 'Buy')
      .reduce((total, transaction) => total + (parseFloat(transaction.price) || 0), 0)
      .toFixed(2);
  };

  // حساب عدد عمليات الإعارة
  const countBorrowTransactions = () => {
    return transactions.filter(t => t.action === 'Borrow').length;
  };

  // حساب عدد عمليات المبيعات
  const countSalesTransactions = () => {
    return transactions.filter(t => t.action === 'Buy').length;
  };

  // حساب عدد عمليات القراءة
  const countReadingTransactions = () => {
    return transactions.filter(t => t.action === 'Read').length;
  };

  // حساب عدد الكتب المعارة حالياً
  const countCurrentlyBorrowed = () => {
    return transactions.filter(t => 
      t.action === 'Borrow' && 
      new Date(t.returnDate) > new Date()
    ).length;
  };

  const borrowIncome = calculateBorrowIncome();
  const salesIncome = calculateSalesIncome();
  const borrowCount = countBorrowTransactions();
  const salesCount = countSalesTransactions();
  const readingCount = countReadingTransactions();
  const currentlyBorrowed = countCurrentlyBorrowed();

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">{t('dashboardTitle')}</h2>

      <div className="stats-cards">
        {/* البطاقات الأساسية */}
        <div className="card stat-card" style={{justifyContent: "unset"}}>
          <div className="stat-icon">📚</div>
          <h5>{t('totalBooks')}</h5>
          <p className="stat-number">{stats.totalBooks}</p>
        </div>

        <div className="card stat-card" style={{justifyContent: "unset"}}>
          <div className="stat-icon">👥</div>
          <h5>{t('customersServed')}</h5>
          <p className="stat-number">{stats.customersServed}</p>
        </div>

        {/* بطاقات الإعارة */}
        <div className="card stat-card borrow-stats">
          <div className="stat-icon">🔄</div>
          <h5>{t('borrowedBooks')}</h5>
          <p className="stat-number">{stats.borrowedBooks}</p>
          <small className="stat-subtext">{t('currentlyBorrowed')}: {currentlyBorrowed}</small>
        </div>

        <div className="card stat-card borrow-income">
          <div className="stat-icon">📊</div>
          <h5>{t('borrowIncome')}</h5>
          <p className="stat-number">${borrowIncome}</p>
          <small className="stat-subtext">{t('from')} {borrowCount} {t('transactions')}</small>
        </div>

        {/* بطاقات المبيعات */}
        <div className="card stat-card sales-stats">
          <div className="stat-icon">💰</div>
          <h5>{t('soldBooks')}</h5>
          <p className="stat-number">{stats.soldBooks}</p>
          <small className="stat-subtext">{t('totalSales')}: {salesCount}</small>
        </div>

        <div className="card stat-card sales-income">
          <div className="stat-icon">💸</div>
          <h5>{t('salesIncome')}</h5>
          <p className="stat-number">${salesIncome}</p>
          <small className="stat-subtext">{t('from')} {salesCount} {t('transactions')}</small>
        </div>

        {/* بطاقات القراءة */}
        <div className="card stat-card reading-stats">
          <div className="stat-icon">📖</div>
          <h5>{t('readInsideLibrary')}</h5>
          <p className="stat-number">{stats.readInLibrary}</p>
          <small className="stat-subtext">{t('totalReadings')}: {readingCount}</small>
        </div>

        {/* بطاقة إجمالي الدخل */}
        <div className="card stat-card total-income">
          <div className="stat-icon">💎</div>
          <h5>{t('totalIncome')}</h5>
          <p className="stat-number">
            ${(parseFloat(borrowIncome) + parseFloat(salesIncome)).toFixed(2)}
          </p>
          <small className="stat-subtext">{t('salesAndBorrows')}</small>
        </div>
      </div>

      {/* إحصائيات مفصلة */}
      <div className="detailed-stats mt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>📈 {t('borrowStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalBorrows')}:</span>
                  <strong>{borrowCount}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('activeBorrows')}:</span>
                  <strong>{currentlyBorrowed}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('averageBorrowPrice')}:</span>
                  <strong>
                    ${borrowCount > 0 ? (parseFloat(borrowIncome) / borrowCount).toFixed(2) : '0.00'}
                  </strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('totalBorrowIncome')}:</span>
                  <strong>${borrowIncome}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>🛒 {t('salesStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalSales')}:</span>
                  <strong>{salesCount}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('booksSold')}:</span>
                  <strong>{stats.soldBooks}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('averageSalePrice')}:</span>
                  <strong>
                    ${salesCount > 0 ? (parseFloat(salesIncome) / salesCount).toFixed(2) : '0.00'}
                  </strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('totalSalesIncome')}:</span>
                  <strong>${salesIncome}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>📖 {t('readingStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalReadings')}:</span>
                  <strong>{readingCount}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('booksRead')}:</span>
                  <strong>{stats.readInLibrary}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('readingSessions')}:</span>
                  <strong>{readingCount}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('popularActivity')}:</span>
                  <strong>
                    {Math.max(borrowCount, salesCount, readingCount) === borrowCount && t('borrowing')}
                    {Math.max(borrowCount, salesCount, readingCount) === salesCount && t('buying')}
                    {Math.max(borrowCount, salesCount, readingCount) === readingCount && t('reading')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-section mt-5">
        <h4>{t('recentlyAddedBooks')}</h4>
        <table className="recent-table">
          <thead>
            <tr>
              <th>{t('title')}</th>
              <th>{t('author')}</th>
              <th>{t('category')}</th>
              <th>{t('status')}</th>
              <th>{t('price')}</th>
              <th>{t('dateAdded')}</th>
            </tr>
          </thead>
          <tbody>
            {recentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>
                  <span className={`status-badge ${book.status}`}>
                    {t(book.status)}
                  </span>
                </td>
                <td>${book.price}</td>
                <td>{new Date(book.addedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;