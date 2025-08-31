import React, { useState, useEffect } from "react";
import './customer.css';
import { useTranslation } from "react-i18next";
import { getCustomers, updateCustomer } from "../../services/apiService";
import { getBooks, updateBook } from "../../services/apiService";

const Customer = () => {
  const { t, i18n } = useTranslation();
  
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ type: 'All' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returningLoanId, setReturningLoanId] = useState(null);
  const [endingSessionId, setEndingSessionId] = useState(null);
  
  // Fetch customers and books data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const customersData = await getCustomers();
        const booksData = await getBooks();
        setTransactions(customersData);
        setBooks(booksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics manually
  const stats = {
    total: transactions.length,
    read: transactions.filter(t => t.action === 'Read').length,
    buy: transactions.filter(t => t.action === 'Buy').length,
    borrow: transactions.filter(t => t.action === 'Borrow').length,
    returned: transactions.filter(t => t.returned).length,
    active: transactions.filter(t => t.action === 'Borrow' && !t.returned).length
  };

  // Active reading sessions
  const readingSessions = transactions.filter(t => 
    t.action === 'Read' && t.status === 'active_reading'
  );
  
  // Active loans
  const activeLoans = transactions.filter(t => 
    t.action === 'Borrow' && !t.returned && new Date(t.returnDate) > new Date()
  );
  
  // Expired loans
  const expiredLoans = transactions.filter(t => 
    t.action === 'Borrow' && !t.returned && new Date(t.returnDate) <= new Date()
  );

  // Filter transactions based on selected filter
  const filteredTransactions = filters.type === 'All' 
    ? transactions 
    : transactions.filter(t => t.action === filters.type);

  // Sort transactions to show newest first
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Sort active sessions to show newest first
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
    setFilters({ type: filterType });
  };

  // تنسيق الوقت المتبقي
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

  // Handle book return
  const handleReturnBook = async (loan) => {
    setReturningLoanId(loan.id);
    
    try {
      // Find the book to know its current state
      const book = books.find(b => b.id === loan.bookId);
      const currentCopies = book ? book.copies : 0;
      const currentStatus = book ? book.status : 'borrow';
      
      // Update the transaction to show as returned
      const updatedTransaction = {
        ...loan,
        returned: true,
        returnTimestamp: new Date().toISOString(),
        status: 'returned'
      };
      
      // Update transactions list locally
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === loan.id ? updatedTransaction : t)
      );
  
      // Determine new status based on copies after return
      const updatedCopies = currentCopies + 1;
      let newStatus = currentStatus;
      
      // If current status is borrow_out and copies become > 0, change to borrow
      if (currentStatus === 'borrow_out' && updatedCopies > 0) {
        newStatus = 'borrow';
      }
      // If status is borrow and copies are > 0, keep as borrow
      else if (currentStatus === 'borrow' && updatedCopies > 0) {
        newStatus = 'borrow';
      }
  
      // Update the book by increasing copies and changing status if needed
      const updatedBook = {
        ...book,
        copies: updatedCopies,
        status: newStatus,
        currentBorrower: null,
        borrowDate: null,
        returnDate: null,
        isBorrowed: false
      };
      
      // Update books list locally
      setBooks(prevBooks => 
        prevBooks.map(b => b.id === loan.bookId ? updatedBook : b)
      );
      
      // Update transaction in API
      await updateCustomer(loan.id, updatedTransaction);
      
      // Update book in API
      await updateBook(loan.bookId, updatedBook);
    } catch (error) {
      console.error("Error returning book:", error);
      setError("Failed to return book. Please try again.");
    }

    // إعادة تعيين بعد ثانيتين
    setTimeout(() => setReturningLoanId(null), 2000);
  };

  // Handle ending a reading session
  const handleEndReadingSession = async (session) => {
    setEndingSessionId(session.id);
    
    try {
      // Find the book to know its current state
      const book = books.find(b => b.id === session.bookId);
      const currentCopies = book ? book.copies : 0;
      const currentStatus = book ? book.status : 'reading';
      
      // Update the transaction
      const updatedTransaction = {
        ...session,
        status: 'completed',
        sessionEnd: new Date().toISOString(),
        duration: Math.round((new Date() - new Date(session.sessionStart)) / 60000),
        returned: true
      };
      
      // Update transactions list locally
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === session.id ? updatedTransaction : t)
      );
  
      // Determine new status based on copies after return
      const updatedCopies = currentCopies + 1;
      let newStatus = currentStatus;
      
      // If current status is reading_out and copies become > 0, change to reading
      if (currentStatus === 'reading_out' && updatedCopies > 0) {
        newStatus = 'reading';
      }
      // If status is reading and copies are > 0, keep as reading
      else if (currentStatus === 'reading' && updatedCopies > 0) {
        newStatus = 'reading';
      }
  
      // Update the book
      const updatedBook = {
        ...book,
        copies: updatedCopies,
        status: newStatus,
        currentReader: null,
        readingStart: null,
        isReading: false,
        readingSessionId: null
      };
      
      // Update books list locally
      setBooks(prevBooks => 
        prevBooks.map(b => b.id === session.bookId ? updatedBook : b)
      );
      
      // Update customer data
      const customer = transactions.find(t => t.customerId === session.customerId);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          activeReadings: Math.max(0, (customer.activeReadings || 0) - 1),
          totalReadings: (customer.totalReadings || 0) + 1
        };
        
        // Update transaction in API
        await updateCustomer(session.id, updatedTransaction);
        
        // Update book in API
        await updateBook(session.bookId, updatedBook);
        
        // Update customer in API if needed
        if (customer.id) {
          await updateCustomer(customer.id, updatedCustomer);
        }
      }
    } catch (error) {
      console.error("Error ending reading session:", error);
      setError("Failed to end reading session. Please try again.");
    }

    setTimeout(() => setEndingSessionId(null), 2000);
  };

  // حساب الإجماليات
  const totalActiveLoans = activeLoans.length;
  const totalExpiredLoans = expiredLoans.length;
  const totalReadingSessions = readingSessions.length;

  // دمج الإعارات وجلسات القراءة في قائمة واحدة مع الفرز
  const allActiveSessions = [
    ...sortedActiveLoans.map(loan => ({ ...loan, type: 'borrow' })),
    ...sortedExpiredLoans.map(loan => ({ ...loan, type: 'borrow', expired: true })),
    ...sortedReadingSessions.map(session => ({ ...session, type: 'reading' }))
  ].sort((a, b) => {
    // فرز الجلسات النشطة حسب التاريخ (الأحدث أولاً)
    const dateA = a.type === 'borrow' ? new Date(a.borrowDate) : new Date(a.sessionStart);
    const dateB = b.type === 'borrow' ? new Date(b.borrowDate) : new Date(b.sessionStart);
    return dateB - dateA;
  });

  return (
    <div className="container py-4" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h2 className="mb-4">👥 {t("customersManagement")}</h2>

      {/* بطاقات الإحصائيات */}
      <div className="stats-cards mb-4">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h5>{t("totalTransactions")}</h5>
          <p className="stat-number">{stats.total}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h5>{t("activeLoans")}</h5>
          <p className="stat-number">{totalActiveLoans}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <h5>{t("expiredLoans")}</h5>
          <p className="stat-number">{totalExpiredLoans}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <h5>{t("activeReadingSessions")}</h5>
          <p className="stat-number">{totalReadingSessions}</p>
        </div>
      </div>

      {/* قسم الجلسات النشطة (الإعارات + القراءة) */}
      {allActiveSessions.length > 0 && (
        <div className="active-sessions-section mb-5">
          <h4 className="mb-3">📋 {t("activeSessionsManagement")}</h4>
          
          <div className="sessions-grid">
            {allActiveSessions.map((session) => {
              if (session.type === 'borrow') {
                const timeLeft = session.returnDate ? formatTimeRemaining(session.returnDate) : { expired: false };
                const isExpired = session.expired || (timeLeft.expired && session.returnDate);
                
                return (
                  <div key={session.id} className={`session-card ${isExpired ? 'expired' : 'active'} borrow-session`}>
                    <div className="session-header">
                      <h6>{session.bookTitle}</h6>
                      <span className="session-type-badge borrow-badge">
                        📚 {t("borrow")}
                      </span>
                      <span className="customer-info">👤 {session.customerName}</span>
                      {session.customerPhone && (
                        <span className="customer-phone">📞 {session.customerPhone}</span>
                      )}
                    </div>
                    
                    <div className="session-details">
                      <div className="session-info">
                        <p><strong>{t("borrowDate")}:</strong> {new Date(session.borrowDate).toLocaleDateString()}</p>
                        <p><strong>{t("returnDate")}:</strong> {new Date(session.returnDate).toLocaleDateString()}</p>
                        <p><strong>{t("price")}:</strong> ${session.price}</p>
                        <p><strong>{t("period")}:</strong> {session.borrowPeriod} {t("days")}</p>
                      </div>
                      
                      {session.returnDate && (
                        <div className="session-timer">
                          {isExpired ? (
                            <span className="text-danger">⏰ {t("expired")}</span>
                          ) : (
                            <div className="time-remaining">
                              <span className="time-display">
                                {timeLeft.days}d {timeLeft.hours}h
                              </span>
                              <small>{t("remaining")}</small>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="session-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReturnBook(session)}
                        disabled={returningLoanId === session.id}
                      >
                        {returningLoanId === session.id ? (
                          <>{t("returning")}...</>
                        ) : (
                          <>{t("returnBook")}</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              } else if (session.type === 'reading') {
                const sessionDuration = Math.round((new Date() - new Date(session.sessionStart)) / 60000);
                
                return (
                  <div key={session.id} className="session-card reading-session">
                    <div className="session-header">
                      <h6>{session.bookTitle}</h6>
                      <span className="session-type-badge reading-badge">
                        📖 {t("readingSession")}
                      </span>
                      <span className="customer-info">👤 {session.customerName}</span>
                      {session.customerPhone && (
                        <span className="customer-phone">📞 {session.customerPhone}</span>
                      )}
                    </div>
                    
                    <div className="session-details">
                      <div className="session-info">
                        <p><strong>{t("author")}:</strong> {session.author}</p>
                        <p><strong>{t("category")}:</strong> {session.category}</p>
                        <p><strong>{t("startTime")}:</strong> {new Date(session.sessionStart).toLocaleString()}</p>
                        <p><strong>{t("duration")}:</strong> {sessionDuration} {t("minutes")}</p>
                      </div>
                    </div>

                    <div className="session-actions">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleEndReadingSession(session)}
                        disabled={endingSessionId === session.id}
                      >
                        {endingSessionId === session.id ? (
                          <>{t("ending")}...</>
                        ) : (
                          <>{t("endSession")}</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* سجل جميع المعاملات */}
      <div className="transactions-section">
        <h4 className="mb-3">📝 {t("transactionsHistory")}</h4>
        
        <div className="filter-buttons mb-3">
          <button className={`btn btn-outline-primary ${filters.type === 'All' ? 'active' : ''}`} 
            onClick={() => handleFilterChange("All")}>
            {t("all")} ({stats.total})
          </button>
          <button className={`btn btn-outline-info ${filters.type === 'Read' ? 'active' : ''}`} 
            onClick={() => handleFilterChange("Read")}>
            {t("read")} ({stats.read})
          </button>
          <button className={`btn btn-outline-success ${filters.type === 'Buy' ? 'active' : ''}`} 
            onClick={() => handleFilterChange("Buy")}>
            {t("purchases")} ({stats.buy})
          </button>
          <button className={`btn btn-outline-warning ${filters.type === 'Borrow' ? 'active' : ''}`} 
            onClick={() => handleFilterChange("Borrow")}>
            {t("borrowing")} ({stats.borrow})
          </button>
        </div>

        {sortedTransactions.length === 0 ? (
          <div className="alert alert-info text-center">
            📭 {t("noRecords")}
          </div>
        ) : (
          <div className="transactions-list">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.returned ? 'returned' : ''} ${transaction.status === 'active_reading' ? 'reading-active' : ''}`}>
                <div className="transaction-header">
                  <strong>{transaction.customerName}</strong>
                  <span className={`action-badge ${transaction.action.toLowerCase()} ${transaction.status}`}>
                    {transaction.action === 'Borrow' && '📚 '}
                    {transaction.action === 'Buy' && '💰 '}
                    {transaction.action === 'Read' && '📖 '}
                    {t(transaction.action.toLowerCase())}
                    {transaction.status === 'active_reading' && ' 🔄'}
                    {transaction.returned && ' ✅'}
                  </span>
                </div>
                
                <div className="transaction-body">
                  <p className="book-title">"{transaction.bookTitle}"</p>
                  
                  <div className="transaction-details">
                    <small className="text-muted">
                      📅 {new Date(transaction.timestamp).toLocaleString()}
                    </small>
                    {transaction.price > 0 && (
                      <small className="text-success">
                        💰 ${transaction.price}
                      </small>
                    )}
                    {transaction.returned && (
                      <small className="text-info">
                        ✅ {t("returned")}
                      </small>
                    )}
                    {transaction.status === 'active_reading' && (
                      <small className="text-warning">
                        🔄 {t("readingActive")}
                      </small>
                    )}
                  </div>
                  
                  {transaction.action === 'Borrow' && transaction.borrowPeriod && (
                    <small className="text-info">
                      ⏳ {transaction.borrowPeriod} {t("days")}
                    </small>
                  )}
                  
                  {transaction.action === 'Read' && transaction.duration && (
                    <small className="text-info">
                      ⏱️ {transaction.duration} {t("minutes")}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customer;