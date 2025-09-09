import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectBooksForReading } from '../../redux/slices/bookSlice';
import { updateBook } from '../../redux/slices/bookSlice';
import { addTransaction } from '../../redux/slices/transactionsSlice';
import { addCustomer } from '../../redux/slices/customerSlice';
import './readingOnly.css'

const ReadingOnly = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  
  const books = useAppSelector(selectBooksForReading);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

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

  // إنشاء معرف عميل فريد
  const generateCustomerId = () => {
    return 'CUST-' + Math.floor(100000 + Math.random() * 900000);
  };

  // معالجة بدء القراءة
  const handleReading = () => {
    if (!selectedBook || !customerName.trim()) {
      setError(t("fillRequiredFields"));
      return;
    }

    // التحقق من نوع الكتاب - يجب أن يكون للقراءة فقط
    if (selectedBook.status !== 'reading' && selectedBook.status !== 'reading_out') {
      setError(t("cannotRead"));
      return;
    }

    // التحقق إذا كانت النسخ = 0
    if (selectedBook.copies <= 0) {
      setError("No copies available");
      return;
    }

    // إنشاء عميل جديد
    const customerId = generateCustomerId();
    const customerData = {
      id: customerId,
      fullName: customerName,
      phone: customerPhone,
      memberId: customerId,
      joinDate: new Date().toISOString().split('T')[0],
      type: 'reading'
    };
    dispatch(addCustomer(customerData));

    // إعداد بيانات المعاملة - للقراءة فقط بدون أي حقول للإعارة
   // إعداد بيانات المعاملة - للقراءة
const transactionData = {
  id: `read-${Date.now()}`,
  customerId: customerId,
  customerName: customerName,
  customerPhone: customerPhone,
  bookId: selectedBook.id,
  bookTitle: selectedBook.title,
  author: selectedBook.author,
  category: selectedBook.category,
  action: "Read",
  price: 5, // <-- تم تعديل السعر ليضيف 1 دولار لكل جلسة قراءة
  timestamp: new Date().toISOString(),
  status: 'active_reading',
  sessionStart: new Date().toISOString(),
  sessionType: 'reading',
  returned: false
};


    // إضافة المعاملة
    dispatch(addTransaction(transactionData));

    // تحديث حالة الكتاب وتقليل عدد النسخ
    const updatedCopies = selectedBook.copies - 1;
    
    // تحديد الحالة الجديدة بناءً على عدد النسخ المتبقية
    let newStatus = selectedBook.status;
    if (updatedCopies === 0) {
      newStatus = 'reading_out';
    }
    
    dispatch(updateBook({
      id: selectedBook.id,
      updates: { 
        copies: updatedCopies,
        status: newStatus,
        currentReader: customerName,
        readingStart: new Date().toISOString(),
        isReading: true,
        readingSessionId: `read-${Date.now()}`
      }
    }));

    // رسالة النجاح
    setMessage(t("readingStarted", {
      book: selectedBook.title,
      customer: customerName
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
    // التحقق إذا كانت النسخ = 0
    if (book.copies <= 0) {
      setError("No copies available");
      return;
    }
    
    // التحقق من نوع الكتاب - يجب أن يكون للقراءة فقط
    if (book.status !== 'reading' && book.status !== 'reading_out') {
      setError(t("cannotRead"));
      return;
    }
    
    setSelectedBook(book);
    setShowCustomerPopup(true);
    setError("");
  };

  return (
    <div className="container py-4" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h2 style={{fontFamily: "Lora", fontWeight: "800", letterSpacing: "1px"}} className="mb-4">📖 {t("readingRoom")}</h2>

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
                className="btn w-100 h-100"
                style={{background: "chocolate", color: "white"}}
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
                      className={`book-result ${(book.status === 'reading' || book.status === 'reading_out') && book.copies > 0 ? 'can-read' : 'cannot-read'}`}
                      onClick={() => (book.status === 'reading' || book.status === 'reading_out') && book.copies > 0 && handleBookSelect(book)}
                    >
                      <div className="book-info">
                        <strong>{book.title}</strong>
                        <div>
                          <small className="text-muted">
                            {t("by")} {book.author} | {t("status")}: {t(book.status)}
                          </small>
                        </div>
                        <div>
                          <small className={book.copies === 0 ? 'text-danger' : 'text-success'}>
                            {t("copies")}: {book.copies}
                            {book.copies === 0 && " - No copies available"}
                          </small>
                        </div>
                      </div>
                      <span className="select-indicator">
                        {(book.status === 'reading' || book.status === 'reading_out') && book.copies > 0 ? "👉" : "❌"}
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
              <h5>📖 {t("readingSession")}</h5>
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
                <p>{t("category")}: {selectedBook.category}</p>
                <p className={selectedBook.copies === 0 ? 'text-danger' : 'text-success'}>
                  {t("availableCopies")}: {selectedBook.copies}
                </p>
                <p className="book-type-badge reading-badge">
                   {t("forReadingOnly")}
                </p>
              </div>

              <div className="form-group">
                <label>{t("customerName")} </label>
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
                  type="number"
                  className="form-control"
                  placeholder={t("enterCustomerPhone")}
                  value={customerPhone}
                  onChange={(e) =>  {
                    const value = e.target.value;
                    if(value === '' || parseInt(value) >= 0) { 
                      setCustomerPhone(e.target.value);
                      }
                  }}
                  min = "0"
                />
              </div>

              <div className="reading-summary">
                <h6>📋 {t("readingSummary")}</h6>
                <p>{t("serviceType")}: <strong>{t("freeReading")}</strong></p>
                <p>{t("noTimeLimit")}</p>
                <p>{t("comfortableEnvironment")}</p>
                <p className="text-success">{t("noChargesApply")}</p>
                <p>{t("copiesAfterReading")}: <strong>{selectedBook.copies - 1}</strong></p>
                {selectedBook.copies - 1 === 0 && (
                  <p className="text-warning">⚠️ No copies will remain during reading session</p>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="btn btn-success"
                onClick={handleReading}
                disabled={!customerName.trim()}
              >
                ✅ {t("startReading")}
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
          <small>📚 {t("sessionSentToCustomerPage")}</small>
          {selectedBook && selectedBook.copies - 1 === 0 && (
            <><br /><small className="text-warning">⚠️ Book status changed to reading_out</small></>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingOnly;