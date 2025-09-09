  import React, { useEffect, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { useAppSelector, useAppDispatch } from '../../redux/hooks';
  import { 
    selectFilteredBooks, 
    selectCategories, 
    selectEditBook,
    setFilters,
    setEditBook,
    updateBook,
    deleteBook 
  } from '../../redux/slices/bookSlice';
  import './booksManagement.css'

  const BooksManagement = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    
    const books = useAppSelector(selectFilteredBooks);
    const categories = useAppSelector(selectCategories);
    const editBook = useAppSelector(selectEditBook);
    
    const [visibleBooksCount, setVisibleBooksCount] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
      dispatch(setFilters({ 
        search: searchTerm,
        category: selectedCategory 
      }));
    }, [searchTerm, selectedCategory, dispatch]);

    const handleEdit = (book) => {
      dispatch(setEditBook(book));
    };

    const handleUpdate = () => {
      if (editBook) {
        dispatch(updateBook({
          id: editBook.id,
          updates: editBook
        }));
        dispatch(setEditBook(null));
      }
    };

    const handleDelete = (id) => {
      if (window.confirm(t('confirmDelete'))) {
        dispatch(deleteBook(id));
      }
    };

    const handleEditChange = (field, value) => {
      if (editBook) {
        const updatedBook = { ...editBook, [field]: value };
        
        // إذا كان الحقل الذي يتم تعديله هو عدد النسخ
        if (field === 'copies') {
          const copiesCount = parseInt(value) || 0;
          
          // منع القيم السالبة في عدد النسخ
          if (copiesCount < 0) return;
          
          // تغيير الحالة تلقائياً بناءً على عدد النسخ والنوع
          if (copiesCount === 0) {
            // إذا أصبح عدد النسخ 0، نغير الحالة إلى النوع المناسب
            if (updatedBook.status === 'sale') {
              updatedBook.status = 'sold_out';
            } else if (updatedBook.status === 'borrow') {
              updatedBook.status = 'borrow_out';
            } else if (updatedBook.status === 'reading') {
              updatedBook.status = 'reading_out';
            }
            // إذا كانت الحالة بالفعل من النوع _out، نتركها كما هي
          } else if (copiesCount > 0) {
            // إذا أصبح عدد النسخ أكبر من 0، نعيد الحالة إلى النوع الأساسي
            if (updatedBook.status === 'sold_out') {
              updatedBook.status = 'sale';
            } else if (updatedBook.status === 'borrow_out') {
              updatedBook.status = 'borrow';
            } else if (updatedBook.status === 'reading_out') {
              updatedBook.status = 'reading';
            }
          }
        }
        
        // منع القيم السالبة في السعر
        if (field === 'price') {
          const priceValue = parseFloat(value) || 0;
          if (priceValue < 0) return;
          updatedBook[field] = priceValue;
        }
        
        dispatch(setEditBook(updatedBook));
      }
    };

    // دالة للتحقق من المدخلات ومنع القيم السالبة
    const handleInputValidation = (e, field) => {
      // السماح فقط بالأرقام والنقطة (للسعر) ومفاتيح التحكم
      if (!/[\d.]/.test(e.key) && 
          e.key !== 'Backspace' && 
          e.key !== 'Delete' && 
          e.key !== 'ArrowLeft' && 
          e.key !== 'ArrowRight' && 
          e.key !== 'Tab') {
        e.preventDefault();
      }
      
      // منع إدخال أكثر من نقطة واحدة للسعر
      if (field === 'price' && e.key === '.' && e.target.value.includes('.')) {
        e.preventDefault();
      }
    };

    // دالة للتحقق من القيم بعد الإدخال
    const handleBlur = (field, value) => {
      if (field === 'copies') {
        const copiesCount = parseInt(value) || 0;
        if (copiesCount < 0) {
          handleEditChange(field, 0);
        }
      }
      
      if (field === 'price') {
        const priceValue = parseFloat(value) || 0;
        if (priceValue < 0) {
          handleEditChange(field, 0);
        }
      }
    };

    // دالة للحصول على النص المعروض للحالة
    const getStatusDisplayText = (status) => {
      switch (status) {
        case 'sale': return t('sale');
        case 'sold_out': return t('sold_out');
        case 'borrow': return t('borrow');
        case 'borrow_out': return t('borrow_out');
        case 'reading': return t('reading');
        case 'reading_out': return t('reading_out');
        default: return status;
      }
    };

    return (
      <>
        <div className="books-management-container">
          <h2>🗂️ {t("booksManagementTitle")}</h2>
          
          <div className="search-filter">
            <input 
              type="text" 
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select 
              value={selectedCategory}  
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">{t("allSections")}</option>
              {categories.map((cat, i) => ( 
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {books.length === 0 ? (
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
                  {books.slice(0, visibleBooksCount).map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publishedDate || book.releaseDate}</td>
                      <td>{book.category}</td>
                      <td>{getStatusDisplayText(book.status)}</td>
                      <td className="text-center">${book.price}</td>
                      <td className="text-center">{book.copies}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEdit(book)}>
                          {t("editButton")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleBooksCount < books.length && (
                <button 
                  className="load-more-button"
                  onClick={() => setVisibleBooksCount(prev => prev + 10)}
                >
                  {t("loadMore")}
                </button>
              )}
            </>
          )}

          {editBook && (
            <div className="edit-popup">
              <h3>{t("editPopupTitle")}</h3>
              <input 
                type="text" 
                value={editBook.title}
                onChange={(e) => handleEditChange('title', e.target.value)}
                placeholder={t("placeholderTitle")}
              />
              <input 
                type="date" 
                value={editBook.publishedDate || editBook.releaseDate}
                onChange={(e) => handleEditChange('publishedDate', e.target.value)}
                placeholder={t('placeholderReleaseDate')}
              />
              <input 
                type="text" 
                value={editBook.category}
                onChange={(e) => handleEditChange('category', e.target.value)}
                placeholder={t("placeholderCategory")}
              />
              <input 
                type="number" 
                min="0"
                value={editBook.price}
                onChange={(e) => handleEditChange('price', e.target.value)}
                onBlur={(e) => handleBlur('price', e.target.value)}
                placeholder={t("placeholderPrice")}
              />

              <input 
                type="number" 
                min="0"
                value={editBook.copies}
                onChange={(e) => handleEditChange('copies', e.target.value)}
                onKeyDown={(e) => handleInputValidation(e, 'copies')}
                onBlur={(e) => handleBlur('copies', e.target.value)}
                placeholder={t("placeholderCopies")}
              />
              <select 
                value={editBook.status}
                onChange={(e) => handleEditChange('status', e.target.value)}
              >
                <option value="sale">{t('sale')}</option>
                <option value="sold_out">{t('sold_out')}</option>
                <option value="borrow">{t('borrow')}</option>
                <option value="borrow_out">{t('borrow_out')}</option>
                <option value="reading">{t('reading')}</option>
                <option value="reading_out">{t('reading_out')}</option>
              </select>
              <div className="edit-buttons">
                <button className="save-button" onClick={handleUpdate}>
                  {t('saveButton')}
                </button>
                <button className="cancel-button" onClick={() => dispatch(setEditBook(null))}>
                  {t('cancelButton')}
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(editBook.id)}>
                  {t('deleteButton')}
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  export default BooksManagement;