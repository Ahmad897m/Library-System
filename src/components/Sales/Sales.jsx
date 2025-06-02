import React, { use, useState } from "react";
import './sales.css'

const Sales = ({ books , addCustomerLog }) => {

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchDone, setSearchDone] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [customerName, setCustomerName] = useState('')
    const [salePrice , setSalePrice] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [soldCount , setSoldCount] = useState(0)


    const handleSearch = () => {
        const results = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLocaleLowerCase() ) && 
    book.isForSale);
    setSearchResults(results)
    setSearchDone(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!selectedBook || !customerName || !salePrice)
        {
            alert('Please fill all fields')
            return;
        }

    setSuccessMsg(`💰 "${selectedBook.title}" sold to ${customerName} for $${salePrice}.`);
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

    }

    return (    
        <>
            <div className="container py-4">
            <h3>💵 Sales Section</h3>
            {successMsg &&(
                <div className="alert alert-success fixed-top text-center mt-3"> 
                    {successMsg}
                </div>
            )}

            <div className="mb-3 mt-4">
                <input 
                type="text"
                className="form-control"
                placeholder="Search for books to sell"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-secondary mt-2 " onClick={handleSearch}>Search</button>
                </div>

                {searchDone && searchResults.length === 0 && (
                    <div className="alert alert-warning"> ❗ No books available for sale found. </div>
                )}

                {searchResults.length > 0 && (
                    <div className="result-list">
                        <h5>Available Books for Sale:</h5>
                        {searchResults.map((book) => (
                            <div key={book.id} className="card p-2 mb-2">
                                <strong>{book.title}</strong> - <em>{book.author}</em> <br />
                                📂 Category: {book.category}<br />
                                💲 Suggested Price: ${book.price}
                                <br />

                                <button className="btn btn-sm btn-outline-success mt-2" onClick={() => {
                                    setSelectedBook(book);
                                    setSalePrice(book.price);
                                }}>Sell This book</button>

                            </div>
                        ))}
                    </div>
                )}

                {selectedBook && (
                     <form className="mt-4" onSubmit={handleSubmit}>
          <h5>📋 Sell Book</h5>
          <p>Selected Book: <strong>{selectedBook.title}</strong></p>

          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Sale Price"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success">Confirm Sale</button>
        </form>
      )}
      

      <hr className="my-4" />
      <div className="alert alert-info">
        🧾 Total books sold: <strong>{soldCount}</strong>
      </div>
    </div>
        </>
    )
}

export default Sales;