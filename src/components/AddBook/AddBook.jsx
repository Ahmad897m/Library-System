import React, { useState } from "react";
import './addBook.css'

const AddBook = () => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        publishedDate: '',
        category: '',
        status: '',
        price:'',
        copies: '',
        description: '',
        cover: null,
    });

    const [successMessage, setSuccessMessage] = useState(false);


    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setBook((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };
const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book data Submitted", book);
    setSuccessMessage(true);

    setTimeout(() => setSuccessMessage(false), 4000);

    setBook({
        title: '',
        author: '',
        publishedDate: '',
        category: '',
        status: '',
        price:'',
        copies: '',
        description: '',
        cover: null,
    });

    document.getElementById("coverInput").value = '';
};

    return(
        <>
            <div className="container mt-4">
                    <h3> 📚 Add New Book</h3>
                             {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ Book added successfully!
                    </div>
                )}
                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" name="title" value={book.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Author</label>
                            <input type="text" className="form-control" name="author" value={book.author} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Release Date</label>
                            <input type="date" className="form-control" name="publishedDate" value={book.publishedDate} onChange={handleChange}  />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <input type="text" className="form-control" name="category" value={book.category} onChange={handleChange}  />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <input type="text" className="form-control" name="status" value={book.status} onChange={handleChange}  required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <div className="input-group ">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" name="price" value={book.price} onChange={handleChange}  required/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Copies</label>
                            <input type="number" className="form-control" name="copies" value={book.copies} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea type="text" className="form-control" name="description" value={book.description} rows='3' onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Cover Image</label>
                            <input id="coverInput" type="file" className="form-control" name="cover" onChange={handleChange} required />
                        </div>


                        <button type="submit" className="btn btn-primary mt-5 add" >Add Book</button>
                    </form>

            </div>
        </>
    )
}

export default AddBook;