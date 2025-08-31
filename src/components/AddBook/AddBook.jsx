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
        status: 'reading', // قيمة افتراضية
        price: '',
        copies: '',
        description: '',
    });

    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // منع القيم السالبة في عدد النسخ والسعر
        if ((name === 'copies' || name === 'price') && value !== '') {
            const numericValue = parseFloat(value);
            if (numericValue < 0) return;
        }
        
        setBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function to validate input and prevent negative values during typing
    const handleKeyPress = (e, fieldName) => {
        // Allow only numbers, decimal point, and control keys
        if (fieldName === 'price' && e.key === '.' && e.target.value.includes('.')) {
            e.preventDefault(); // Prevent more than one decimal point
            return;
        }
        
        if (!/[\d.]/.test(e.key) && 
            e.key !== 'Backspace' && 
            e.key !== 'Delete' && 
            e.key !== 'ArrowLeft' && 
            e.key !== 'ArrowRight' && 
            e.key !== 'Tab') {
            e.preventDefault();
        }
    };

    // Function to validate values after input
    const handleBlur = (e, fieldName) => {
        const value = e.target.value;
        
        if ((fieldName === 'copies' || fieldName === 'price') && value !== '') {
            const numericValue = parseFloat(value);
            
            if (numericValue < 0) {
                setBook((prev) => ({
                    ...prev,
                    [fieldName]: fieldName === 'copies' ? '1' : '0'
                }));
            }
            
            // Ensure copies is at least 1
            if (fieldName === 'copies' && numericValue < 1) {
                setBook((prev) => ({
                    ...prev,
                    copies: '1'
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Convert numeric values and validate
            const bookData = {
                ...book,
                price: book.price ? Math.max(0, parseFloat(book.price)) : 0,
                copies: book.copies ? Math.max(1, parseInt(book.copies)) : 1,
                // If reading only, set price to 0
                price: book.status === 'reading' ? 0 : (book.price ? Math.max(0, parseFloat(book.price)) : 0),
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
                status: 'reading',
                price: '',
                copies: '',
                description: '',
            });
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
                        <select className="form-control" name="status" value={book.status} onChange={handleChange} required>
                            <option value="reading">{t('reading')}</option>
                            <option value="borrow">{t('borrow')}</option>
                            <option value="sale">{t('sale')}</option>
                        </select>
                    </div>

                    {book.status !== 'reading' && (
                        <div className="mb-3">
                            <label className="form-label">{t('price')}</label>
                            <div className="input-group ">
                                <span className="input-group-text">$</span>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="price" 
                                    value={book.price} 
                                    onChange={handleChange}  
                                    onKeyDown={(e) => handleKeyPress(e, 'price')}
                                    onBlur={(e) => handleBlur(e, 'price')}
                                    required={book.status !== 'reading'}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">{t('copies')}</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            name="copies" 
                            value={book.copies} 
                            onChange={handleChange} 
                            onKeyDown={(e) => handleKeyPress(e, 'copies')}
                            onBlur={(e) => handleBlur(e, 'copies')}
                            required 
                            min="1"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('description')}</label>
                        <textarea className="form-control" name="description" value={book.description} rows='3' onChange={handleChange} required />
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