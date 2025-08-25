import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './addBook.css';
import { addBook } from "../../services/apiService";

const AddBook = () => {
    const { t } = useTranslation();

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
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setBook((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create a new book object without the cover file
            // since JSON Server can't handle file uploads
            const bookData = {
                ...book,
                cover: book.cover ? book.cover.name : null, // Just store the filename
                id: Date.now() // Generate a unique ID
            };
            
            // Call the API service to add the book
            await addBook(bookData);
            
            setSuccessMessage(true);
            setErrorMessage("");

            setTimeout(() => setSuccessMessage(false), 4000);

            // Reset the form
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
        } catch (error) {
            console.error("Error adding book:", error);
            setErrorMessage("Failed to add book. Please try again.");
            setTimeout(() => setErrorMessage(""), 4000);
        }
    };

    return(
        <>
            <div className="container mt-4">
                <h3> {t('addNewBook')}</h3>

                {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ {t('bookAddedSuccess')}
                    </div>
                )}

                {errorMessage && (
                    <div className="alert alert-danger mt-3" role="alert">
                        ❌ {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mb-3">
                        <label className="form-label">{t('title')}</label>
                        <input type="text" className="form-control" name="title" value={book.title} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('author')}</label>
                        <input type="text" className="form-control" name="author" value={book.author} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('releaseDate')}</label>
                        <input type="date" className="form-control" name="publishedDate" value={book.publishedDate} onChange={handleChange}  />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('category')}</label>
                        <input type="text" className="form-control" name="category" value={book.category} onChange={handleChange}  />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('status')}</label>
                        <input type="text" className="form-control" name="status" value={book.status} onChange={handleChange}  required/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('price')}</label>
                        <div className="input-group ">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" name="price" value={book.price} onChange={handleChange}  required/>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('copies')}</label>
                        <input type="number" className="form-control" name="copies" value={book.copies} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('description')}</label>
                        <textarea type="text" className="form-control" name="description" value={book.description} rows='3' onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('coverImage')}</label>
                        <input id="coverInput" type="file" className="form-control" name="cover" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary mt-5 add" >
                        {t('addBook')}
                    </button>
                </form>
            </div>
        </>
    )
}

export default AddBook;
