import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './addBook.css'

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        // منع القيم السالبة في عدد النسخ والسعر
        if ((name === 'copies' || name === 'price') && value !== '') {
            const numericValue = parseFloat(value);
            if (numericValue < 0) return;
        }

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
            price: '',
            copies: '',
            description: '',
            cover: null,
        });

        document.getElementById("coverInput").value = '';
    };

    return (
        <>
            <div className="container mt-4">
                <h3> {t('addNewBook')}</h3>

                {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ {t('bookAddedSuccess')}
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
                        <input type="date" className="form-control" name="publishedDate" value={book.publishedDate} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('category')}</label>
                        <input type="text" className="form-control" name="category" value={book.category} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t('status')}</label>
                        <input type="text" className="form-control" name="status" value={book.status} onChange={handleChange}  required/>
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
                    </div>

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
