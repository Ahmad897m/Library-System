import React, { useState } from "react";
import './issueBook.css';
import { useTranslation } from 'react-i18next';

const IssueBook = () => {
  const { t, i18n } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [borrowPeriod, setBorrowPeriod] = useState("2");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const books = [
    { id: 1, title: "Book A", section: "Science", author: "Author A", isBorrowable: true },
    { id: 2, title: "Book B", section: "History", author: "Author B", isBorrowable: false },
    { id: 3, title: "Book C", section: "Math", author: "Author C", isBorrowable: true },
  ];

  const handleSearch = () => {
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return results;
  };

  // Handle borrowing
  const handleBorrow = async () => {
    if (!selectedBook || !customerName.trim()) {
      setError(t("fillRequiredFields"));
      return;
    }

    // Check if book is for borrowing only
    if (selectedBook.status !== 'borrow') {
      setError(t("cannotBorrow"));
      return;
    }

    // Check if copies = 0 and show message in English
    if (selectedBook.copies <= 0) {
      setError("No copies available");
      return;
    }

    try {
      // Create new customer
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
      
      // Add customer to API
      await addCustomer(customerData);

      // Calculate borrow dates and price
      const borrowDate = new Date();
      const returnDate = new Date();
      if (borrowType === "Borrow") returnDate.setDate(returnDate.getDate() + 7);
      if (borrowType === "Sale") returnDate.setDate(returnDate.getDate() + 2);

      setMessage(
        `${t("recordedMessage", {
          type: t(borrowType.toLowerCase()),
          title: selectedBook.title,
          username: username
        })}\n${t("expectedReturn", {
          date: returnDate.toLocaleDateString(i18n.language)
        })}`
      );
      setError("");
    }
  };

  const results = handleSearch();

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