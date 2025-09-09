import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from '../../redux/hooks';
import { addBook } from '../../redux/slices/bookSlice';
import './addBook.css'

const AddBook = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

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

    // دالة للتحقق من المدخلات ومنع القيم السالبة أثناء الكتابة
    const handleKeyPress = (e, fieldName) => {
        // السماح فقط بالأرقام والنقطة (للسعر) ومفاتيح التحكم
        if (fieldName === 'price' && e.key === '.' && e.target.value.includes('.')) {
            e.preventDefault(); // منع إدخال أكثر من نقطة واحدة
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

    // دالة للتحقق من القيم بعد الإدخال
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
            
            // التأكد من أن عدد النسخ لا يقل عن 1
            if (fieldName === 'copies' && numericValue < 1) {
                setBook((prev) => ({
                    ...prev,
                    copies: '1'
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // تحويل القيم الرقمية إلى أرقام مع التحقق من القيم السالبة
        const bookToAdd = {
            ...book,
            price: book.price ? Math.max(0, parseFloat(book.price)) : 0,
            copies: book.copies ? Math.max(1, parseInt(book.copies)) : 1,
            // إذا كان للقراءة فقط، نجعل السعر 0
            price: book.status === 'reading' ? 0 : (book.price ? Math.max(0, parseFloat(book.price)) : 0)
        };
        
        // إضافة الكتاب عبر Redux
        dispatch(addBook(bookToAdd));
        
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 4000);

        // مسح الحقول
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
    };

    return(
        <>
            <div className="container mt-4">
                <h3>➕ {t('addNewBook')}</h3>

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
                        <input 
                        type="date" 
                        className="form-control" 
                        name="publishedDate" 
                        value={book.publishedDate} 
                        onChange={handleChange}  
                        min="1500-01-01"
                        max={new Date().toISOString().split("T")[0]} 
                        />

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