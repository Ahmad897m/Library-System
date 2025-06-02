import React, { useEffect, useState } from "react";
import './booksManagement.css'

const BooksManagement = () => {
// testing date

const mocBooks = Array.from({length: 100}, (_, i) => ({
  id: i + 1,
  title: `Book ${i + 1}`,
  author: `Author ${i % 10}`,
  releaseDate: `2025-05-${(i % 30) + 1}`,
  category: `Section ${Math.floor(i/10) + 1}`,
  status: (i % 3 === 0) ? "Borrow Only" : ( i % 3 === 1 ? "Sell & Borrow" : "Read Only" ),
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
                <h2>Books Management</h2>
                <div className="search-filter">
                  <input 
                  type="text" 
                  placeholder="Search...!"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <select value={selectedCategory}  onChange={(e) => setSelectedCategory(e.target.value)} name="" id="">
                    <option value="All"> All Sections</option>
                    {[...new Set(books.map((b) => b.category))].map((cat, i) =>( 
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                  {filteredBooks.length === 0 ? (
                    <p className="no-books-message">There are not book ....!</p>
                  ) : (
                    
                    <>
             
                <table className="books-table">
                    <thead>
                        <tr>
                            {/* <th>Cover</th> */}
                            <th >Title</th>
                            <th>Author</th>
                            <th>Release Date</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>price</th>
                            <th>copies</th>
                            <th>Actions</th>
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
                          <button className="edit-button" onClick={() => handleEdit(book)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
                </table> 

                {visibleBooksCount < filteredBooks.length && (
                  <button 
                  className="load-more-button"
                  onClick={() => setVisibleBooksCount(prev => prev + 10)}>Load More</button>
             )}
             </>
             )}   

                {editBook && (
                  <div className="edit-popup">
                    <h3>Edit Book Info</h3>
                    <input type="text" 
                    value={editBook.title}
                    onChange={(e) => setEditBook({...editBook, title: e.target.value})}
                    placeholder="Title"
                    />
                    <input type="text" 
                    value={editBook.releaseDate}
                    onChange={(e) => setEditBook({...editBook, releaseDate: e.target.value})}
                    placeholder="Release Date"
                    />
                    <input type="text" 
                    value={editBook.category}
                    onChange={(e) => setEditBook({...editBook, category: e.target.value})}
                    placeholder="Category"
                    />
                    <input type="number" 
                    value={editBook.price}
                    onChange={(e) => setEditBook({...editBook, price: e.target.value })}
                    placeholder="Price"
                    />
                    <select 
                    value={editBook.status}
                    onChange={(e) => setEditBook({...editBook, status: e.target.value})}>
                      <option value="Borrow only">Borrow Only</option>
                      <option value="Sell & Borrow">Sell & Borrow</option>
                      <option value="Read Only">Read Only</option>

                    </select>
                    <div className="edit-buttons">
                      <button className="save-button" onClick={handleUpdate}>Save</button>
                      <button className="cancel-button" onClick={() => setEditBook(null)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(editBook.id)}>Delete</button>
                    </div>
                    
                  </div>
                )}
            </div>
        </>
    )
}

export default BooksManagement;