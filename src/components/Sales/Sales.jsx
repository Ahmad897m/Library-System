import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectBooksForSale } from '../../redux/slices/bookSlice';
import { sellBook } from '../../redux/slices/bookSlice';
import { addTransaction } from '../../redux/slices/transactionsSlice';
import { addCustomer } from '../../redux/slices/customerSlice';
import './sales.css';

const Sales = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  
  const books = useAppSelector(selectBooksForSale);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [soldCount, setSoldCount] = useState(0);

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

  // معالجة البيع
  const handleSale = () => {
    if (!selectedBook || !customerName.trim() || !salePrice) {
      setError(t("fillRequiredFields"));
      return;
    }

    // التحقق من نوع الكتاب - يجب أن يكون للبيع فقط
    if (selectedBook.status !== 'sale') {
      setError(t("cannotSell"));
      return;
    }

    if (selectedBook.copies <= 0) {
      setError(t("noCopiesAvailable"));
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
      type: 'sale'
    };
    dispatch(addCustomer(customerData));

    // إعداد بيانات المعاملة
    const transactionData = {
      id: Date.now().toString(),
      customerId: customerId,
      customerName: customerName,
      customerPhone: customerPhone,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      action: "Buy",
      price: parseFloat(salePrice),
      timestamp: new Date().toISOString(),
    };

    // إضافة المعاملة
    dispatch(addTransaction(transactionData));

    // تحديث حالة الكتاب وتقليل عدد النسخ
    dispatch(sellBook({ 
      bookId: selectedBook.id, 
      soldPrice: parseFloat(salePrice) 
    }));

    // رسالة النجاح
    setMessage(t("saleSuccess", {
      book: selectedBook.title,
      customer: customerName,
      price: salePrice
    }));

    setSoldCount(prev => prev + 1);

    // إغلاق البوب أب وإعادة التعيين
    setShowCustomerPopup(false);
    setSelectedBook(null);
    setCustomerName("");
    setCustomerPhone("");
    setSalePrice("");
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
    
    // التحقق إذا كان الكتاب للبيع
    if (book.status !== 'sale') {
      setError(t("cannotSell"));
      return;
    }
    
    setSelectedBook(book);
    setSalePrice(book.price || "");
    setShowCustomerPopup(true);
    setError("");
  };

  return (
    <div className="container py-4" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h2 style={{fontFamily: "Lora", fontWeight: "800", letterSpacing: "1px"}} className="mb-4">💰 {t("salesSection")}</h2>

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
                      className={`book-result ${book.status === 'sale' && book.copies > 0 ? 'can-sell' : 'cannot-sell'}`}
                      onClick={() => book.status === 'sale' && book.copies > 0 && handleBookSelect(book)}
                    >
                      <div className="book-info">
                        <strong>{book.title}</strong>
                        <div>
                          <small className="text-muted">
                            {t("by")} {book.author} | {t("status")}: {t(book.status)}
                            {book.status === 'sold_out' && " 🏷️"}
                          </small>
                        </div>
                        <div>
                          <small className={book.copies === 0 ? 'text-danger' : 'text-success'}>
                            {t("copies")}: {book.copies} | {t("price")}: ${book.price}
                            {book.status === 'sold_out' && ` - ${t("completelySold")}`}
                          </small>
                        </div>
                        {book.status === 'sold_out' && (
                          <small className="text-info">
                            💡 {t("manageInBooksManagement")}
                          </small>
                        )}
                      </div>
                      <span className="select-indicator">
                        {book.status === 'sale' && book.copies > 0 ? "👉" : "❌"}
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
      {showCustomerPopup && selectedBook && (
        <div className="customer-popup-overlay">
          <div className="customer-popup">
            <div className="popup-header">
              <h5>💰 {t("sellBook")}</h5>
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
                </p>
                <p className="book-type-badge sale-badge">
                   {t("forSaleOnly")}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if(value === ' ' || parseInt(value) >= 0 ) {
                      setCustomerPhone(e.target.value)}
                    }
                  }
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>{t("salePrice")} </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={t("enterSalePrice")}
                  value={salePrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === ' ' || parseInt(value) >= 0){

                      setSalePrice(e.target.value)}
                    }
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="sale-summary">
                <h6>📋 {t("saleSummary")}</h6>
                <p>{t("copiesAfterSale")}: <strong>{selectedBook.copies - 1}</strong></p>
                <p>{t("amountToReceive")}: <strong>${salePrice}</strong></p>
                {selectedBook.copies - 1 === 0 && (
                  <p className="text-warning"> {t("lastCopyWarning")}</p>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="btn btn-success"
                onClick={handleSale}
                disabled={!customerName.trim() || !salePrice}
              >
                ✅ {t("confirmSale")}
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
        </div>
      )}

    </div>
  );
};

export default Sales;