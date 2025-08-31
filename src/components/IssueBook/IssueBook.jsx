import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { addTransaction } from '../../redux/slices/transactionsSlice';
import { updateBook } from '../../redux/slices/bookSlice';
import { addCustomer } from '../../redux/slices/customerSlice';
import { selectBooks } from '../../redux/slices/bookSlice';
import './issueBook.css';

const IssueBook = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  
  const books = useAppSelector(selectBooks);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [borrowPeriod, setBorrowPeriod] = useState("2");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

  // أسعار الإعارة
  const borrowPrices = {
    "2": 0.10, // 10%
    "7": 0.20, // 20%
    "15": 0.25 // 25%
  };

  // البحث في الكتب
  const searchBooks = () => {
    if (!searchTerm.trim()) return [];
    
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm)
    );
  };

  const results = searchBooks();

  // حساب سعر الإعارة
  const calculateBorrowPrice = () => {
    if (!selectedBook || !selectedBook.price) return 0;
    const price = parseFloat(selectedBook.price);
    const percentage = borrowPrices[borrowPeriod];
    return (price * percentage).toFixed(2);
  };

  // إنشاء معرف عميل فريد
  const generateMemberId = () => {
    return 'CUST-' + Math.floor(100000 + Math.random() * 900000);
  };

  // معالجة الإعارة
  const handleBorrow = () => {
    if (!selectedBook || !customerName.trim()) {
      setError(t("fillRequiredFields"));
      return;
    }

    // التحقق من نوع الكتاب - يجب أن يكون للإعارة فقط
    if (selectedBook.status !== 'borrow') {
      setError(t("cannotBorrow"));
      return;
    }

    // التحقق إذا كانت النسخ = 0 وإظهار رسالة باللغة الإنجليزية
    if (selectedBook.copies <= 0) {
      setError("No copies available");
      return;
    }

    // إنشاء عميل جديد
    const customerId = generateMemberId();
    const customerData = {
      id: customerId,
      fullName: customerName,
      phone: customerPhone,
      memberId: customerId,
      joinDate: new Date().toISOString().split('T')[0],
      activeLoans: 1,
      totalLoans: 1
    };
    dispatch(addCustomer(customerData));

    // حساب تواريخ الإعارة والسعر
    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + parseInt(borrowPeriod));
    const borrowPrice = calculateBorrowPrice();

    // إعداد بيانات المعاملة
    const transactionData = {
      id: Date.now().toString(),
      customerId: customerId,
      customerName: customerName,
      customerPhone: customerPhone,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      action: "Borrow",
      borrowPeriod: borrowPeriod,
      borrowDate: borrowDate.toISOString(),
      returnDate: returnDate.toISOString(),
      price: borrowPrice,
      amountPaid: borrowPrice,
      timestamp: new Date().toISOString(),
      status: 'active',
      returned: false
    };

    // إضافة المعاملة
    dispatch(addTransaction(transactionData));

    // تحديث حالة الكتاب وتقليل عدد النسخ
    const updatedCopies = selectedBook.copies - 1;
    
    // تحديد الحالة الجديدة بناءً على عدد النسخ المتبقية
    const newStatus = updatedCopies === 0 ? 'borrow_out' : 'borrow';
    
    const updates = {
      copies: updatedCopies,
      status: newStatus,
      currentBorrower: customerName,
      borrowDate: borrowDate.toISOString(),
      returnDate: returnDate.toISOString(),
      isBorrowed: true
    };

    // إزالة الحقول غير الضرورية إذا كانت القيمة null أو undefined
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    });

    dispatch(updateBook({
      id: selectedBook.id,
      updates: updates
    }));

    // رسالة النجاح
    setMessage(t("borrowSuccess", {
      book: selectedBook.title,
      customer: customerName,
      price: borrowPrice
    }));

    // إغلاق البوب أب وإعادة التعيين
    setShowCustomerPopup(false);
    setSelectedBook(null);
    setCustomerName("");
    setCustomerPhone("");
    setError("");

    setTimeout(() => setMessage(""), 4000);
  };

  // فتح بوب أب إدخال البيانات عند اختيار كتاب
  const handleBookSelect = (book) => {
    // التحقق إذا كانت النسخ = 0 وإظهار رسالة فورية
    if (book.copies <= 0) {
      setError("No copies available");
      setShowCustomerPopup(false);
      return;
    }
    
    // التحقق من نوع الكتاب - يجب أن يكون للإعارة فقط
    if (book.status !== 'borrow') {
      setError(t("cannotBorrow"));
      return;
    }
    
    setSelectedBook(book);
    setShowCustomerPopup(true);
    setError("");
  };

  return (
    <div className="container py-4" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h2 className="mb-4">📚 {t("bookBorrowSystem")}</h2>

      {/* البحث عن الكتاب */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🔍 {t("searchBook")}</h5>
          <div className="row g-2">
            <div className="col-md-8">
              <input
                type="text"
                placeholder={t("searchBookPlaceholder")}
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setShowResults(true)}
              />
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-primary w-100 h-100"
                onClick={() => setShowResults(true)}
              >
                {t("search")}
              </button>
            </div>
          </div>

          {showResults && (
            <div className="mt-3">
              <h6>{t("searchResults")} ({results.length})</h6>
              {results.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  {t("noBooksFound")}
                </div>
              ) : (
                <div className="search-results">
                  {results.map((book) => (
                    <div
                      key={book.id}
                      className={`book-result ${book.status === 'borrow' && book.copies > 0 ? 'can-borrow' : 'cannot-borrow'}`}
                      onClick={() => book.status === 'borrow' && book.copies > 0 && handleBookSelect(book)}
                    >
                      <div className="book-info">
                        <strong>{book.title}</strong>
                        <div>
                          <small className="text-muted">
                            {t("by")} {book.author} | {t("status")}: {t(book.status)}
                            {book.currentBorrower && ` | 📖 ${t("currentlyBorrowedBy")} ${book.currentBorrower}`}
                          </small>
                        </div>
                        <div>
                          <small className={`${book.copies === 0 ? 'text-danger' : 'text-info'}`}>
                            {t("copies")}: {book.copies} | {t("price")}: ${book.price}
                            {book.copies === 0 && " - No copies available"}
                          </small>
                        </div>
                      </div>
                      <span className="select-indicator">
                        {book.status === 'borrow' && book.copies > 0 ? "👉" : "❌"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* بوب أب إدخال بيانات العميل */}
      {showCustomerPopup && selectedBook && selectedBook.copies > 0 && (
        <div className="customer-popup-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h5>📖 {t("borrowBook")}</h5>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowCustomerPopup(false);
                  setSelectedBook(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="popup-body">
              <div className="selected-book-info">
                <h6>{selectedBook.title}</h6>
                <p>{t("by")} {selectedBook.author}</p>
                <p>{t("originalPrice")}: ${selectedBook.price}</p>
                <p className={selectedBook.copies === 0 ? 'text-danger' : 'text-success'}>
                  {t("availableCopies")}: {selectedBook.copies}
                  {selectedBook.copies === 0 && " - No copies available"}
                </p>
                <p className="book-type-badge">
                  {selectedBook.status === 'borrow' && "📚 " + t("forBorrow")}
                </p>
              </div>

              <div className="form-group">
                <label>{t("customerName")} *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("enterCustomerName")}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t("customerPhone")}</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder={t("enterCustomerPhone")}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>⏳ {t("borrowPeriod")}</label>
                <div className="borrow-options">
                  <div className="borrow-option">
                    <input
                      type="radio"
                      name="borrowPeriod"
                      value="2"
                      checked={borrowPeriod === "2"}
                      onChange={(e) => setBorrowPeriod(e.target.value)}
                    />
                    <label>
                      {t("twoDays")} - ${calculateBorrowPrice()} (10%)
                    </label>
                  </div>
                  <div className="borrow-option">
                    <input
                      type="radio"
                      name="borrowPeriod"
                      value="7"
                      checked={borrowPeriod === "7"}
                      onChange={(e) => setBorrowPeriod(e.target.value)}
                    />
                    <label>
                      {t("oneWeek")} - ${calculateBorrowPrice()} (20%)
                    </label>
                  </div>
                  <div className="borrow-option">
                    <input
                      type="radio"
                      name="borrowPeriod"
                      value="15"
                      checked={borrowPeriod === "15"}
                      onChange={(e) => setBorrowPeriod(e.target.value)}
                    />
                    <label>
                      {t("fifteenDays")} - ${calculateBorrowPrice()} (25%)
                    </label>
                  </div>
                </div>
              </div>

              <div className="borrow-summary">
                <h6>💰 {t("borrowSummary")}</h6>
                <p>{t("amountToPay")}: <strong>${calculateBorrowPrice()}</strong></p>
                <p>{t("returnDate")}: {
                  new Date(Date.now() + parseInt(borrowPeriod) * 24 * 60 * 60 * 1000)
                    .toLocaleDateString(i18n.language)
                }</p>
                <p>{t("copiesAfterBorrow")}: <strong>{selectedBook.copies - 1}</strong></p>
                {selectedBook.copies - 1 === 0 && (
                  <p className="text-warning">⚠️ No copies will remain after this borrow</p>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="btn btn-primary"
                onClick={handleBorrow}
                disabled={!customerName.trim() || selectedBook.copies <= 0}
              >
                ✅ {t("confirmBorrow")}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCustomerPopup(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الرسائل */}
      {error && (
        <div className="alert alert-danger mt-3">
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success mt-3">
          ✅ {message}
          <br />
          <small>📚 {t("copiesRemaining")}: {selectedBook ? selectedBook.copies - 1 : 0}</small>
          {selectedBook && selectedBook.copies - 1 === 0 && (
            <><br /><small className="text-warning">⚠️ Book status changed to borrow_out</small></>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueBook;