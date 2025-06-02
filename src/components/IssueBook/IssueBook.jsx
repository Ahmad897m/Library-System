import React, { useState } from "react";
import './issueBook.css';

const booksDatabase = [
  {
    id: 1,
    title: "JavaScript Essentials",
    author: "John Doe",
    type: 'daily',
    category: 'section 1',
    borrowable: true,
    borrowDuration: 7,
    isInternalReadOnly: true,
    isForSale: true
  },
  {
    id: 2,
    title: "React Guide",
    author: "Jane Smith",
    type: 'weekly',
    category: 'section 1',
    borrowable: true,
    borrowDuration: 2,
    isInternalReadOnly: false,
    isForSale: false
  },
  {
    id: 3,
    title: "Rare Manuscript",
    author: "Historical Writer",
    type: 'in-library',
    category: 'section 3',
    borrowable: false,
    borrowDuration: 0,
    isInternalReadOnly: true,
    isForSale: false
  }
];

const IssueBook = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [username, setUsername] = useState('');
  const [serviceType, setServiceType] = useState('borrow');
  const [successMsg, setSuccessMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false); 
 

  // زر البحث
  const handleSearch = () => {
    const results = booksDatabase.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
   setHasSearched(true);
  setSelectedBook(null);
  };
  // حساب التاريخ

  const calculateReturnDate = (bookType) => {
    const today = new Date();
    if (bookType === 'weekly') today.setDate(today.getDate() + 7);
    else if (bookType === 'daily') today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  };

  // زر تنفيذ العملية

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    const expectedReturnDate = calculateReturnDate(selectedBook.type);
    const expectedDate = new Date(expectedReturnDate);

    const message =
      selectedBook.type === 'in-library' && serviceType === 'borrow'
        ? '❌ This book is for internal reading only and cannot be borrowed.'
        : `✅ "${serviceType}" recorded for the book "${selectedBook.title}" by user "${username}".` +
          (serviceType === 'borrow'
            ? ` 📅 Expected return date: ${expectedReturnDate}`
            : '');
          
    setSuccessMsg(message);
    setUsername('');
    setServiceType('borrow');
    setSelectedBook(null);

    setTimeout(() => {
      const now = new Date();
      if (serviceType === 'borrow' && now > expectedDate) {
        alert('⚠️ Return overdue! Please take appropriate action.');
      }
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <>
      {successMsg && (
    <div className="alert alert-success fixed-top text-center p-3" style={{ zIndex: 9999 }}>
      {successMsg}
    </div>
  )}

    <div className="container mt-4">
      <h3>Issue / Return</h3>

      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="Search a book by title, section, or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-secondary mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>

{searchResults.length > 0 && (
  <div className="result-list">
    <h5>Search Results:</h5>
    {searchResults.map((book) => (
      <div key={book.id} className="card p-2 mb-2">
        <strong>{book.title}</strong> — <em>{book.author}</em><br />
        📂 Section: {book.category}<br />
        📦 Borrowable: {book.borrowable ? 'Yes' : 'No'}<br />
        <button
          className="btn btn-sm btn-outline-primary mt-2"
          onClick={() => setSelectedBook(book)}
        >
          Select this book
        </button>
      </div>
    ))}
  </div>
)}
{hasSearched && searchResults.length === 0 && (
  <div className="alert alert-warning mt-3">
    No books found for "<strong>{search}</strong>".
  </div>
)}


      {selectedBook && (
        <div className=" shadow-sm card pop-card p-3 mb-4">
          <h5>📘 {selectedBook.title}</h5>
          <p>
            Borrow Type:{" "}
            {selectedBook.type === "weekly"
              ? "Weekly"
              : selectedBook.type === "daily"
              ? "2 Days"
              : "Internal Reading Only"}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <select
                className="form-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="borrow">Borrow</option>
                <option value="sale">Sale</option>
                <option value="read">Read Internally</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Transaction
            </button>
          </form>
        </div>
      )}

    </div>
        </>
  );
};

export default IssueBook;
