import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { 
  selectFilteredTransactions, 
  selectActiveLoans,
  selectExpiredLoans,
  setTransactionFilters,
  updateTransaction,
  deleteTransaction
} from '../../redux/slices/transactionsSlice';
import { updateBook } from '../../redux/slices/bookSlice';
import { returnBook, updateCustomer } from '../../redux/slices/customerSlice';
import './customer.css'

const Customer = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  
  const filteredTransactions = useAppSelector(selectFilteredTransactions);
  const activeLoans = useAppSelector(selectActiveLoans);
  const expiredLoans = useAppSelector(selectExpiredLoans);
  const filters = useAppSelector(state => state.transactions.filters);
  
  const allTransactions = useAppSelector(state => state.transactions.transactions);
  const books = useAppSelector(state => state.books.books);
  const [returningLoanId, setReturningLoanId] = useState(null);
  const [endingSessionId, setEndingSessionId] = useState(null);
  const [deletingTransactions, setDeletingTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // عدد الإشعارات الظاهرة

  // حساب الإحصائيات يدوياً
  const stats = {
    total: allTransactions.length,
    read: allTransactions.filter(t => t.action === 'Read').length,
    buy: allTransactions.filter(t => t.action === 'Buy').length,
    borrow: allTransactions.filter(t => t.action === 'Borrow').length,
    returned: allTransactions.filter(t => t.returned).length,
    active: allTransactions.filter(t => t.action === 'Borrow' && !t.returned).length
  };

  const readingSessions = allTransactions.filter(t => 
    t.action === 'Read' && t.status === 'active_reading'
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const sortedActiveLoans = [...activeLoans].sort((a, b) => 
    new Date(b.borrowDate) - new Date(a.borrowDate)
  );
  
  const sortedExpiredLoans = [...expiredLoans].sort((a, b) => 
    new Date(b.borrowDate) - new Date(a.borrowDate)
  );
  
  const sortedReadingSessions = [...readingSessions].sort((a, b) => 
    new Date(b.sessionStart) - new Date(a.sessionStart)
  );

  const handleFilterChange = (filterType) => {
    dispatch(setTransactionFilters({ type: filterType }));
    setVisibleCount(10); // إعادة تعيين عدد الإشعارات عند تغيير الفلتر
  };

  const handleDeleteTransaction = (transactionId) => {
    setDeletingTransactions(prev => [...prev, transactionId]);
    
    setTimeout(() => {
      dispatch(deleteTransaction(transactionId));
      setDeletingTransactions(prev => prev.filter(id => id !== transactionId));
    }, 500);
  };

  const handleDeleteAllTransactions = () => {
    if (window.confirm(t("confirmDeleteAllTransactions"))) {
      const transactionIds = sortedTransactions.map(t => t.id);
      setDeletingTransactions(transactionIds);
      
      setTimeout(() => {
        transactionIds.forEach(id => dispatch(deleteTransaction(id)));
        setDeletingTransactions([]);
      }, 500);
    }
  };

  const handleDeleteByType = (type) => {
    if (window.confirm(t("confirmDeleteTypeTransactions", { type: t(type.toLowerCase()) }))) {
      const transactionsToDelete = sortedTransactions.filter(t => t.action === type);
      const transactionIds = transactionsToDelete.map(t => t.id);
      
      setDeletingTransactions(transactionIds);
      
      setTimeout(() => {
        transactionIds.forEach(id => dispatch(deleteTransaction(id)));
        setDeletingTransactions([]);
      }, 500);
    }
  };

  const formatTimeRemaining = (returnDate) => {
    const now = new Date();
    const returnDateTime = new Date(returnDate);
    const ms = returnDateTime - now;
    
    if (ms <= 0) return { expired: true };
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  };

  const handleReturnBook = (loan) => {
    setReturningLoanId(loan.id);
    const book = books.find(b => b.id === loan.bookId);
    const currentCopies = book ? book.copies : 0;
    const currentStatus = book ? book.status : 'borrow';
    
    dispatch(updateTransaction({
      id: loan.id,
      updates: {
        returned: true,
        returnTimestamp: new Date().toISOString(),
        status: 'returned'
      }
    }));

    const updatedCopies = currentCopies + 1;
    let newStatus = currentStatus;
    if (currentStatus === 'borrow_out' && updatedCopies > 0) newStatus = 'borrow';
    else if (currentStatus === 'borrow' && updatedCopies > 0) newStatus = 'borrow';

    dispatch(updateBook({
      id: loan.bookId,
      updates: {
        copies: updatedCopies,
        status: newStatus,
        currentBorrower: null,
        borrowDate: null,
        returnDate: null,
        isBorrowed: false
      }
    }));

    dispatch(returnBook({ customerId: loan.customerId, bookId: loan.bookId }));
    setTimeout(() => setReturningLoanId(null), 2000);
  };

  const handleEndReadingSession = (session) => {
    setEndingSessionId(session.id);
    const book = books.find(b => b.id === session.bookId);
    const currentCopies = book ? book.copies : 0;
    const currentStatus = book ? book.status : 'reading';
    
    dispatch(updateTransaction({
      id: session.id,
      updates: {
        status: 'completed',
        sessionEnd: new Date().toISOString(),
        duration: Math.round((new Date() - new Date(session.sessionStart)) / 60000),
        returned: true
      }
    }));

    const updatedCopies = currentCopies + 1;
    let newStatus = currentStatus;
    if (currentStatus === 'reading_out' && updatedCopies > 0) newStatus = 'reading';
    else if (currentStatus === 'reading' && updatedCopies > 0) newStatus = 'reading';

    dispatch(updateBook({
      id: session.bookId,
      updates: {
        copies: updatedCopies,
        status: newStatus,
        currentReader: null,
        readingStart: null,
        isReading: false,
        readingSessionId: null
      }
    }));

    dispatch(updateCustomer({
      id: session.customerId,
      updates: {
        activeReadings: (prev) => Math.max(0, (prev || 0) - 1),
        totalReadings: (prev) => (prev || 0) + 1
      }
    }));

    setTimeout(() => setEndingSessionId(null), 2000);
  };

  const totalActiveLoans = activeLoans.length;
  const totalExpiredLoans = expiredLoans.length;
  const totalReadingSessions = readingSessions.length;

  const allActiveSessions = [
    ...sortedActiveLoans.map(loan => ({ ...loan, type: 'borrow' })),
    ...sortedExpiredLoans.map(loan => ({ ...loan, type: 'borrow', expired: true })),
    ...sortedReadingSessions.map(session => ({ ...session, type: 'reading' }))
  ].sort((a, b) => {
    const dateA = a.type === 'borrow' ? new Date(a.borrowDate) : new Date(a.sessionStart);
    const dateB = b.type === 'borrow' ? new Date(b.borrowDate) : new Date(b.sessionStart);
    return dateB - dateA;
  });

  // الإشعارات المرئية مع زر See More
  const visibleTransactions = sortedTransactions.slice(0, visibleCount);
  const handleSeeMore = () => setVisibleCount(prev => prev + 10);

  return (
    <div className="container py-4" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h2 className="mb-4">👥 {t("customersManagement")}</h2>

      {/* بطاقات الإحصائيات */}
      <div className="stats-cards mb-4">
        <div className="stat-card"><div className="stat-icon">📊</div><h5>{t("totalTransactions")}</h5><p className="stat-number">{stats.total}</p></div>
        <div className="stat-card"><div className="stat-icon">📚</div><h5>{t("activeLoans")}</h5><p className="stat-number">{totalActiveLoans}</p></div>
        <div className="stat-card"><div className="stat-icon">⏰</div><h5>{t("expiredLoans")}</h5><p className="stat-number">{totalExpiredLoans}</p></div>
        <div className="stat-card"><div className="stat-icon">📖</div><h5>{t("activeReadingSessions")}</h5><p className="stat-number">{totalReadingSessions}</p></div>
      </div>

      {/* سجل جميع المعاملات */}
      <div className="transactions-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">📝 {t("transactionsHistory")}</h4>
          {sortedTransactions.length > 0 && (
            <div className="delete-buttons">
              <button className="btn btn-danger btn-sm" onClick={handleDeleteAllTransactions} disabled={deletingTransactions.length > 0}>
                🗑️ {t("deleteAll")}
              </button>
            </div>
          )}
        </div>

        <div className="filter-buttons mb-3">
          <button className={`btn btn-outline-primary ${filters.type === 'All' ? 'active' : ''}`} onClick={() => handleFilterChange("All")}>{t("all")} ({stats.total})</button>
          <button className={`btn btn-outline-info ${filters.type === 'Read' ? 'active' : ''}`} onClick={() => handleFilterChange("Read")}>{t("read")} ({stats.read})</button>
          <button className={`btn btn-outline-success ${filters.type === 'Buy' ? 'active' : ''}`} onClick={() => handleFilterChange("Buy")}>{t("purchases")} ({stats.buy})</button>
          <button className={`btn btn-outline-warning ${filters.type === 'Borrow' ? 'active' : ''}`} onClick={() => handleFilterChange("Borrow")}>{t("borrowing")} ({stats.borrow})</button>
        </div>

        {visibleTransactions.length === 0 ? (
          <div className="alert alert-info text-center">📭 {t("noRecords")}</div>
        ) : (
          <div className="transactions-list">
            {visibleTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.returned ? 'returned' : ''} ${transaction.status === 'active_reading' ? 'reading-active' : ''} ${deletingTransactions.includes(transaction.id) ? 'deleting' : ''}`}>
                <div className="transaction-header">
                  <strong>{transaction.customerName}</strong>
                  <div className="d-flex align-items-center">
                    <span className={`action-badge ${transaction.action.toLowerCase()} ${transaction.status} me-2`}>
                      {t(transaction.action.toLowerCase())} {transaction.status === 'active_reading' && ' 🔄'} {transaction.returned && ' ✅'}
                    </span>
                    <button className="btn btn-outline-danger btn-sm delete-transaction-btn" onClick={() => handleDeleteTransaction(transaction.id)} disabled={deletingTransactions.includes(transaction.id)} title={t("deleteTransaction")}>
                      {deletingTransactions.includes(transaction.id) ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
                <div className="transaction-body">
                  <p className="book-title">"{transaction.bookTitle}"</p>
                  <div className="transaction-details">
                    <small className="text-muted">📅 {new Date(transaction.timestamp).toLocaleString()}</small>
                    {transaction.price > 0 && <small className="text-success">💰 ${transaction.price}</small>}
                    {transaction.returned && <small className="text-info">✅ {t("returned")}</small>}
                    {transaction.status === 'active_reading' && <small className="text-warning">🔄 {t("readingActive")}</small>}
                  </div>
                  {transaction.action === 'Borrow' && transaction.borrowPeriod && <small className="text-info">⏳ {transaction.borrowPeriod} {t("days")}</small>}
                  {transaction.action === 'Read' && transaction.duration && <small className="text-info">⏱️ {transaction.duration} {t("minutes")}</small>}
                </div>
              </div>
            ))}

            {visibleCount < sortedTransactions.length && (
              <div className="text-center mt-3">
                <button className="btn btn-outline-white" style={{background: "chocolate", color: "white"}} onClick={handleSeeMore}> {t("seeMore")}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customer;
