import React, { useState } from "react";
import './issueBook.css';
import { useTranslation } from 'react-i18next';

const IssueBook = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowType, setBorrowType] = useState("Borrow");
  const [username, setUsername] = useState("");
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

  const handleTransaction = () => {
    if (selectedBook && !selectedBook.isBorrowable && borrowType === "Borrow") {
      setError(t("cannotBorrow"));
      setMessage("");
    } else {
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
