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

  // حساب إجمالي دخل جلسات القراءة
  const calculateReadingIncome = () => {
    return transactions
      .filter(t => t.action === 'Read')
      .reduce((total, transaction) => total + (parseFloat(transaction.price) || 0), 0)
      .toFixed(2);
  };

  // حساب عدد عمليات الإعارة
  const countBorrowTransactions = () => transactions.filter(t => t.action === 'Borrow').length;

  // حساب عدد عمليات المبيعات
  const countSalesTransactions = () => transactions.filter(t => t.action === 'Buy').length;

  // حساب عدد جلسات القراءة
  const countReadingTransactions = () => transactions.filter(t => t.action === 'Read').length;

  // حساب عدد الكتب المعارة حالياً
  const countCurrentlyBorrowed = () => {
    return transactions.filter(t => 
      t.action === 'Borrow' && 
      !t.returned &&
      t.returnDate &&
      new Date(t.returnDate) > new Date()
    ).length;
  };

  const borrowIncome = calculateBorrowIncome();
  const salesIncome = calculateSalesIncome();
  const readingIncome = calculateReadingIncome();

  const borrowCount = countBorrowTransactions();
  const salesCount = countSalesTransactions();
  const readingCount = countReadingTransactions();
  const currentlyBorrowed = countCurrentlyBorrowed();

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">📈 {t('dashboardTitle')}</h2>

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
          <h5>{t('totalBorrows')}</h5>
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
          <h5>{t('totalSales')}</h5>
          <p className="stat-number">{stats.soldBooks}</p>
          <small className="stat-subtext">{t('booksSold')}: {stats.soldBooks}</small>
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
          <h5>{t('totalReadings')}</h5>
          <p className="stat-number">{stats.readInLibrary}</p>
          <small className="stat-subtext">{t('readingSessions')}: {readingCount}</small>
        </div>

        <div className="card stat-card reading-income">
          <div className="stat-icon">📖</div>
          <h5>{t('readingIncome')}</h5>
          <p className="stat-number">${readingIncome}</p>
          <small className="stat-subtext">{t('from')} {readingCount} {t('transactions')}</small>
        </div>

        {/* بطاقة إجمالي الدخل */}
        <div className="card stat-card total-income">
          <div className="stat-icon">💎</div>
          <h5>{t('totalIncome')}</h5>
          <p className="stat-number">
            ${(parseFloat(borrowIncome) + parseFloat(salesIncome) + parseFloat(readingIncome)).toFixed(2)}
          </p>
          <small className="stat-subtext">{t('salesAndBorrows')}</small>
        </div>
      </div>

      {/* إحصائيات مفصلة */}
      <div className="detailed-stats mt-5">
        <div className="row">
          {/* إحصاءات الإعارة */}
          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>📈 {t('borrowStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalBorrows')}:</span>
                  <strong>{stats.borrowedBooks}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('activeBorrows')}:</span>
                  <strong>{currentlyBorrowed}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('averageBorrowPrice')}:</span>
                  <strong>
                    ${stats.borrowedBooks > 0 ? (parseFloat(borrowIncome) / stats.borrowedBooks).toFixed(2) : '0.00'}
                  </strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('totalBorrowIncome')}:</span>
                  <strong>${borrowIncome}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* إحصاءات المبيعات */}
          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>🛒 {t('salesStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalSales')}:</span>
                  <strong>{stats.soldBooks}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('booksSold')}:</span>
                  <strong>{stats.soldBooks}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('averageSalePrice')}:</span>
                  <strong>
                    ${stats.soldBooks > 0 ? (parseFloat(salesIncome) / stats.soldBooks).toFixed(2) : '0.00'}
                  </strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('totalSalesIncome')}:</span>
                  <strong>${salesIncome}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* إحصاءات القراءة */}
          <div className="col-md-4">
            <div className="card stat-detail-card">
              <h5>📖 {t('readingStatistics')}</h5>
              <div className="stat-details">
                <div className="stat-detail-item">
                  <span>{t('totalReadings')}:</span>
                  <strong>{stats.readInLibrary}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('readingSessions')}:</span>
                  <strong>{readingCount}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('totalReadingIncome')}:</span>
                  <strong>${readingIncome}</strong>
                </div>
                <div className="stat-detail-item">
                  <span>{t('popularActivity')}:</span>
                  <strong>
                    {Math.max(stats.borrowedBooks, stats.soldBooks, stats.readInLibrary) === stats.borrowedBooks && t('borrowing')}
                    {Math.max(stats.borrowedBooks, stats.soldBooks, stats.readInLibrary) === stats.soldBooks && t('buying')}
                    {Math.max(stats.borrowedBooks, stats.soldBooks, stats.readInLibrary) === stats.readInLibrary && t('reading')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الكتب المضافة مؤخراً */}
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
              <td>
                {new Date(book.addedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                })}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
