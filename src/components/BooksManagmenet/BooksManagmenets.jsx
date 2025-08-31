import React, { useEffect, useState } from "react";
import './booksManagement.css'
import { useTranslation } from "react-i18next";
import { getBooks, updateBook, deleteBook } from "../../services/apiService";

const BooksManagement = () => {
  const { t } = useTranslation();

  // Remove mocBooks array as we'll fetch from API

  // status
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleBooksCount, setVisibleBooksCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editBook, setEditBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(t("errorFetchingBooks"));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [t]);

  useEffect(() => {
    let filtered = books.filter(
      (book) => 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.releaseDate?.toLowerCase().includes(searchTerm) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if(selectedCategory !== "All") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);


  const handleEdit = (book) => {
    setEditBook(book)
  }

  //Update book
  const handleUpdate = async () => {
    try {
      await updateBook(editBook.id, editBook);
      const updatedBooks = books.map((b) => (b.id === editBook.id ? editBook : b));
      setBooks(updatedBooks);
      setEditBook(null);
    } catch (err) {
      console.error("Error updating book:", err);
      // You could add error state and display to user here
    }
  };

  //delete Book
  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      const updatedBooks = books.filter((book) => book.id !== id);
      setBooks(updatedBooks);
      setEditBook(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      // You could add error state and display to user here
    }
  };

  return (
    <>
      <div className="books-management-container">
        <h2>{t("booksManagementTitle")}</h2>
        <div className="search-filter">
          <input 
            type="text" 
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} name="" id="">
            <option value="All">{t("allSections")}</option>
            {[...new Set(books.map((b) => b.category))].map((cat, i) =>( 
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>{t("loading")}</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="no-books-message">{t("noBooksMessage")}</p>
        ) : (
          <>
            <table className="books-table">
              <thead>
                <tr>
                  <th>{t("tableTitle")}</th>
                  <th>{t("tableAuthor")}</th>
                  <th>{t("tableReleaseDate")}</th>
                  <th>{t("tableCategory")}</th>
                  <th>{t("tableStatus")}</th>
                  <th>{t("tablePrice")}</th>
                  <th>{t("tableCopies")}</th>
                  <th>{t("tableActions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.slice(0, visibleBooksCount).map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publishedDate}</td>
                    <td>{book.category}</td>
                    <td>{book.status}</td>
                    <td className="text-center">{book.price}</td>
                    <td className="text-center">{book.copies}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(book)}>{t("editButton")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 

            {visibleBooksCount < filteredBooks.length && (
              <button 
                className="load-more-button"
                onClick={() => setVisibleBooksCount(prev => prev + 10)}>{t("loadMore")}</button>
            )}
          </>
        )}   

        {editBook && (
          <div className="edit-popup">
            <h3>{t("editPopupTitle")}</h3>
            <input type="text" 
              value={editBook.title}
              onChange={(e) => setEditBook({...editBook, title: e.target.value})}
              placeholder={t("placeholderTitle")}
            />
            <input type="text" 
              value={editBook.releaseDate}
              onChange={(e) => setEditBook({...editBook, releaseDate: e.target.value})}
              placeholder={t('placeholderReleaseDate')}
            />
            <input type="text" 
              value={editBook.category}
              onChange={(e) => setEditBook({...editBook, category: e.target.value})}
              placeholder={t("placeholderCategory")}
            />
            <input type="number" 
              value={editBook.price}
              onChange={(e) => setEditBook({...editBook, price: e.target.value })}
              placeholder={t("placeholderPrice")}
            />
            <select 
              value={editBook.status}
              onChange={(e) => setEditBook({...editBook, status: e.target.value})}>
              <option value="Borrow only">{t('statusBorrowOnly')}</option>
              <option value="Sell & Borrow">{t('statusSellBorrow')}</option>
              <option value="Read Only">{t('statusReadOnly')}</option>
            </select>
            <div className="edit-buttons">
              <button className="save-button" onClick={handleUpdate}>{t('saveButton')}</button>
              <button className="cancel-button" onClick={() => setEditBook(null)}>{t('cancelButton')}</button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(editBook.id)}>{t('deleteButton')}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default BooksManagement;