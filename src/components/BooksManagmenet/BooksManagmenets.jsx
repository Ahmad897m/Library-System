import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BooksManagement = () => {
// testing date

  const { t } = useTranslation();


const mocBooks = Array.from({length: 100}, (_, i) => ({
  id: i + 1,
  title: `Book ${i + 1}`,
  author: `Author ${i % 10}`,
  releaseDate: `2025-05-${(i % 30) + 1}`,
  category: `${t("sectionName")} ${Math.floor(i/10) + 1}`,
  status: (i % 3 === 0) ? t("statusBorrowOnly") : ( i % 3 === 1 ? t("statusSellBorrow") : t("statusReadOnly") ),
  price: `${i * 2}$`,
  copies: i + 2
}))

// status

const [books, setBooks] = useState(mocBooks);
const [visibleBooksCount, setVisibleBooksCount] = useState(10);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [editBook, setEditBook] = useState(null);
const [filteredBooks, setFilteredBooks] = useState([]);


useEffect (() => {
  let filtered = books.filter(
    (book) => 
      book.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || 
      book.author.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      book.releaseDate.toLocaleLowerCase().includes(searchTerm) ||
      book.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
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
const handleUpdate = () => {
  const updatedBooks = books.map((b) => (b.id === editBook.id ? editBook : b));
  setBooks(updatedBooks);
  setEditBook(null);
  // setShowForm(false); 
};

//delete Book
const handleDelete = (id) => {
  const updatedBooks = books.filter((book) => book.id !== id);
  setBooks(updatedBooks);
  setEditBook(null);
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

                  <select value={selectedCategory}  onChange={(e) => setSelectedCategory(e.target.value)} name="" id="">
                    <option value="All">{t("allSections")}</option>
                    {[...new Set(books.map((b) => b.category))].map((cat, i) =>( 
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                  {filteredBooks.length === 0 ? (
                    <p className="no-books-message">{t("noBooksMessage")}</p>
                  ) : (
                    
                    <>
             
                <table className="books-table">
                    <thead>
                        <tr>
                            {/* <th>Cover</th> */}
                            <th >{t("tableTitle")}</th>
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
                      <tr key={book.id} >
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.releaseDate}</td>
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