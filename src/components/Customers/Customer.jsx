import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { 
  selectFilteredTransactions, 
  selectActiveLoans,
  selectExpiredLoans,
  setTransactionFilters,
  updateTransaction
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

  // حساب الإحصائيات يدوياً
  const stats = {
    total: allTransactions.length,
    read: allTransactions.filter(t => t.action === 'Read').length,
    buy: allTransactions.filter(t => t.action === 'Buy').length,
    borrow: allTransactions.filter(t => t.action === 'Borrow').length,
    returned: allTransactions.filter(t => t.returned).length,
    active: allTransactions.filter(t => t.action === 'Borrow' && !t.returned).length
  };

  // جلسات القراءة النشطة
  const readingSessions = allTransactions.filter(t => 
    t.action === 'Read' && t.status === 'active_reading'
  );

  // فرز المعاملات لعرض الأحدث أولاً
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // فرز الجلسات النشطة لعرض الأحدث أولاً
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

  // معالجة إرجاع الكتاب
  const handleReturnBook = (loan) => {
    setReturningLoanId(loan.id);
    
    // العثور على الكتاب لمعرفة حالته الحالية
    const book = books.find(b => b.id === loan.bookId);
    const currentCopies = book ? book.copies : 0;
    const currentStatus = book ? book.status : 'borrow';
    
    // تحديث المعاملة لتظهر كمُرجعة
    dispatch(updateTransaction({
      id: loan.id,
      updates: {
        returned: true,
        returnTimestamp: new Date().toISOString(),
        status: 'returned'
      }
    }));

    // تحديد الحالة الجديدة بناءً على عدد النسخ بعد الإرجاع
    const updatedCopies = currentCopies + 1;
    let newStatus = currentStatus;
    
    // إذا كانت الحالة الحالية هي borrow_out وتصبح النسخ أكبر من 0، نغيرها إلى borrow
    if (currentStatus === 'borrow_out' && updatedCopies > 0) {
      newStatus = 'borrow';
    }
    // إذا كانت الحالة borrow وتصبح النسخ أكبر من 0، نبقى على borrow
    else if (currentStatus === 'borrow' && updatedCopies > 0) {
      newStatus = 'borrow';
    }

    // تحديث الكتاب بزيادة عدد النسخ وتغيير الحالة إذا لزم الأمر
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

    // تحديث إحصاءات العميل
    dispatch(returnBook({
      customerId: loan.customerId,
      bookId: loan.bookId
    }));

    // إعادة تعيين بعد ثانيتين
    setTimeout(() => setReturningLoanId(null), 2000);
  };

  // معالجة إنهاء جلسة القراءة
  const handleEndReadingSession = (session) => {
    setEndingSessionId(session.id);
    
    // العثور على الكتاب لمعرفة حالته الحالية
    const book = books.find(b => b.id === session.bookId);
    const currentCopies = book ? book.copies : 0;
    const currentStatus = book ? book.status : 'reading';
    
    // تحديث المعاملة
    dispatch(updateTransaction({
      id: session.id,
      updates: {
        status: 'completed',
        sessionEnd: new Date().toISOString(),
        duration: Math.round((new Date() - new Date(session.sessionStart)) / 60000),
        returned: true
      }
    }));

    // تحديد الحالة الجديدة بناءً على عدد النسخ بعد الإرجاع
    const updatedCopies = currentCopies + 1;
    let newStatus = currentStatus;
    
    // إذا كانت الحالة الحالية هي reading_out وتصبح النسخ أكبر من 0، نغيرها إلى reading
    if (currentStatus === 'reading_out' && updatedCopies > 0) {
      newStatus = 'reading';
    }
    // إذا كانت الحالة reading وتصبح النسخ أكبر من 0، نبقى على reading
    else if (currentStatus === 'reading' && updatedCopies > 0) {
      newStatus = 'reading';
    }

    // تحديث الكتاب بزيادة عدد النسخ وتغيير الحالة إذا لزم الأمر
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

    // تحديث إحصاءات العميل
    dispatch(updateCustomer({
      id: session.customerId,
      updates: {
        activeReadings: (prev) => Math.max(0, (prev || 0) - 1),
        totalReadings: (prev) => (prev || 0) + 1
      }
    }));

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

                          {filteredCustomers.length === 0 ? (
        <div className="alert alert-warning"> {t("no_records")} </div>
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
        {t("total_transactions")} <strong>{customersLog.length}</strong>
      </div>
                      
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