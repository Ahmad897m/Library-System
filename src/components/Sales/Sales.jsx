import React, { useState } from "react";
import './sales.css';
import { useTranslation } from "react-i18next";

const Sales = ({ books, addCustomerLog }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [soldCount, setSoldCount] = useState(0);

  const handleSearch = () => {
    const results = books.filter(
      book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        book.isForSale
    );
    setSearchResults(results);
    setSearchDone(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBook || !customerName || !salePrice) {
      alert(t("please_fill_all_fields"));
      return;
    }

    setSuccessMsg(
      t("book_sold_success", {
        title: selectedBook.title,
        name: customerName,
        price: salePrice,
      })
    );
    setSoldCount(prev => prev + 1);

    addCustomerLog({
      name: customerName,
      action: "Buy",
      bookTitle: selectedBook.title
    });

    setSelectedBook(null);
    setCustomerName('');
    setSalePrice('');
    setSearchTerm('');
    setSearchResults([]);
    setSearchDone(false);

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <>
      <div className="container py-4">
        <h3>{t("sales_section")}</h3>

        {successMsg && (
          <div className="alert alert-success fixed-top text-center mt-3">
            {successMsg}
          </div>
        )}

        <div className="mb-3 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-secondary mt-2" onClick={handleSearch}>
            {t("search")}
          </button>
        </div>

        {searchDone && searchResults.length === 0 && (
          <div className="alert alert-warning">
            {t("no_books_found")}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="result-list">
            <h5>{t("available_books")}</h5>
            {searchResults.map((book) => (
              <div key={book.id} className="card p-2 mb-2">
                <strong>{book.title}</strong> - <em>{book.author}</em>
                <br />
                {t("category")}: {book.category}
                <br />
                {t("suggested_price")}: ${book.price}
                <br />
                <button
                  className="btn btn-sm btn-outline-success mt-2"
                  onClick={() => {
                    setSelectedBook(book);
                    setSalePrice(book.price);
                  }}
                >
                  {t("sell_this_book")}
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedBook && (
          <form className="shadow-sm card pop-card p-3 mb-4" onSubmit={handleSubmit}>
            <h5>{t("sell_book")}</h5>
            <p>{t("selected_book")}: <strong>{selectedBook.title}</strong></p>

            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={t("customer_name_placeholder")}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <input
                type="number"
                className="form-control"
                placeholder={t("sale_price_placeholder")}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success">
              {t("confirm_sale")}
            </button>
          </form>
        )}

        <hr className="my-4" />
        <div className="alert alert-info">
          {t("total_books_sold")}: <strong>{soldCount}</strong>
        </div>
      </div>
    </>
  );
};

export default Sales;
