import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './readingOnly.css'

const ReadingOnly = ({ books, addCustomerLog }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [readCount, setReadCount] = useState(0);

  const handleSearch = () => {
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (book.internalReadOnly || book.isForSale || book.isBorrowable)
    );
    setSearchResults(results);
    setSearchDone(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook || !customerName) {
      alert(t("pleaseSelectBookAndName"));
      return;
    }

    addCustomerLog({
      name: customerName,
      action: t("read"),
      bookTitle: selectedBook.title
    });

    setSuccessMsg(t("readingStarted", { title: selectedBook.title, username: customerName }));
    setReadCount((prev) => prev + 1);
    setSelectedBook(null);
    setCustomerName('');
    setSearchTerm('');
    setSearchResults([]);
    setSearchDone(false);

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="container py-4">
      <h3>📖 {t("readingRoom")}</h3>

      {successMsg && (
        <div className="alert alert-success fixed-top text-center mt-3">
          {successMsg}
        </div>
      )}

      <div className="mb-3 mt-4">
        <input
          type="text"
          className="form-control"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-secondary mt-2" onClick={handleSearch}>
          {t("search")}
        </button>
      </div>

      {searchDone && searchResults.length === 0 && (
        <div className="alert alert-warning">
          ❗ {t("noResultsInternal", { term: searchTerm })}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="result-list">
          <h5>{t("internalReadingAvailable")}</h5>
          {searchResults.map((book) => (
            <div key={book.id} className="card p-2 mb-2">
              <strong>{book.title}</strong> - <em>{book.author}</em>
              <br />
              📂 {t("category")}: {book.category}
              <br />
              <button
                className="btn btn-sm btn-outline-success mt-2"
                onClick={() => setSelectedBook(book)}
              >
                {t("selectBook")}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <form
          className="mt-4 pop-card shadow-sm card p-3 mb-4"
          onSubmit={handleSubmit}
        >
          <h5>{t("readingSession")}</h5>
          <p>
            {t("selectedBook")}: <strong>{selectedBook.title}</strong>
          </p>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t("customerName")}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {t("startReading")}
          </button>
        </form>
      )}

      <hr className="my-4" />
      <div className="alert alert-info">
        📚 {t("totalReadCount")}: <strong>{readCount}</strong>
      </div>
    </div>
  );
};

export default ReadingOnly;
