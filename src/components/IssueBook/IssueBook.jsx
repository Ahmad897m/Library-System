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
  const [borrowType, setBorrowType] = useState("Borrow");
  const [username, setUsername] = useState("");
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
      <h2>{t("issueReturn")}</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          {t("search")}
        </button>
      </div>

      {searchTerm && (
        <div className="mb-3">
          <h5>{t("searchResults")}</h5>
          {results.length === 0 ? (
            <div className="alert alert-warning">
              {t("noResults", { term: searchTerm })}
            </div>
          ) : (
            <ul className="list-group">
              {results.map((book) => (
                <li key={book.id} className="list-group-item">
                  <strong>{book.title}</strong> - {t("section")} {book.section}, {t("borrowable")} {book.isBorrowable ? "✅" : "❌"}
                  <button className="btn btn-sm btn-outline-success ms-3" onClick={() => setSelectedBook(book)}>
                    {t("selectBook")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedBook && (
        <div className="card p-3 mt-4">
          <h5>{t("borrowType")}</h5>
          <div className="form-check">
            <input
              type="radio"
              value="Borrow"
              name="borrowType"
              className="form-check-input"
              checked={borrowType === "Borrow"}
              onChange={(e) => setBorrowType(e.target.value)}
            />
            <label className="form-check-label">{t("weekly")}</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              value="Sale"
              name="borrowType"
              className="form-check-input"
              checked={borrowType === "Sale"}
              onChange={(e) => setBorrowType(e.target.value)}
            />
            <label className="form-check-label">{t("daily")}</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              value="Read"
              name="borrowType"
              className="form-check-input"
              checked={borrowType === "Read"}
              onChange={(e) => setBorrowType(e.target.value)}
            />
            <label className="form-check-label">{t("internalOnly")}</label>
          </div>

          <input
            type="text"
            className="form-control mt-3"
            placeholder={t("usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="btn btn-primary mt-3" onClick={handleTransaction}>
            {t("submitTransaction")}
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {message && <div className="alert alert-success mt-3" style={{ whiteSpace: "pre-line" }}>{message}</div>}
    </div>
  );
};

export default IssueBook;
