import { createSlice } from '@reduxjs/toolkit';
import { localStorageService } from '../../services/localStorageService';

const initialState = {
  books: localStorageService.getBooks(),
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'All',
    status: 'All'
  },
  editBook: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // إضافة كتاب جديد
    addBook: (state, action) => {
      const newBook = {
        id: Date.now().toString(),
        addedDate: new Date().toISOString(),
        ...action.payload
      };
      localStorageService.addBook(newBook);
      state.books.push(newBook);
    },
    
    // إعارة كتاب
    borrowBook: (state, action) => {
      const bookId = action.payload;
      const book = state.books.find(book => book.id === bookId);
      
      if (book && book.status === 'borrow' && book.copies > 0) {
        book.copies -= 1;
        localStorageService.saveBooks(state.books);
      }
    },
    
    // بيع كتاب - معدلة لتنقيص النسخ
  sellBook: (state, action) => {
    const { bookId, soldPrice } = action.payload;
    const book = state.books.find(book => book.id === bookId);
    
    if (book && book.status === 'sale' && book.copies > 0) {
      book.copies -= 1;
      
      // إذا نفذت جميع النسخ، تغيير الحالة إلى sold_out
      if (book.copies === 0) {
        book.status = 'sold_out';
      }
      
      localStorageService.saveBooks(state.books);
    }
},
    
    // قراءة كتاب (لا تنقص النسخ)
    markAsRead: (state, action) => {
      const { bookId, customerName } = action.payload;
      const book = state.books.find(book => book.id === bookId);
      
      if (book && book.status === 'reading') {
        // يمكنك إضافة سجل للقراءة أو أي منطق إضافي هنا
        console.log(`Book ${bookId} read by ${customerName}`);
      }
    },
    
    // تحديث كتاب
updateBook: (state, action) => {
   const { id, updates } = action.payload;
  const index = state.books.findIndex(book => book.id === id);
  
  if (index !== -1) {
    // معالجة التحديثات الخاصة
    const processedUpdates = {};
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'function') {
        // إذا كانت دالة، ننفذها مع القيمة الحالية
        processedUpdates[key] = updates[key](state.books[index][key]);
      } else {
        processedUpdates[key] = updates[key];
      }
    });
    
    // إذا كان يتم تحديث عدد النسخ وكانت الحالة sold_out
    if ('copies' in processedUpdates && state.books[index].status === 'sold_out') {
      // إذا أصبح عدد النسخ أكبر من 0، نعيد الحالة إلى sale
      if (processedUpdates.copies > 0) {
        processedUpdates.status = 'sale';
      }
    }
    
    state.books[index] = { ...state.books[index], ...processedUpdates };
    localStorageService.saveBooks(state.books);
  }
},
    
    // حذف كتاب
    deleteBook: (state, action) => {
      const id = action.payload;
      state.books = state.books.filter(book => book.id !== id);
      localStorageService.saveBooks(state.books);
    },
    
    // تعيين كتاب للتحرير
    setEditBook: (state, action) => {
      state.editBook = action.payload;
    },
    
    // مسح كتاب التحرير
    clearEditBook: (state) => {
      state.editBook = null;
    },
    
    // تعيين عوامل التصفية
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // مسح عوامل التصفية
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'All',
        status: 'All'
      };
    },
    
    // تعيين حالة التحميل
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // تعيين الخطأ
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectBooks = (state) => state.books.books;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;
export const selectEditBook = (state) => state.books.editBook;
export const selectBooksFilters = (state) => state.books.filters;

// كتب للبيع
export const selectBooksForSale = (state) => 
  state.books.books.filter(book => book.status === 'sale' && book.copies > 0);

// كتب للإعارة
export const selectBooksForBorrow = (state) =>
  state.books.books.filter(book => book.status === 'borrow' && book.copies > 0);

// كتب للقراءة
export const selectBooksForReading = (state) =>
  state.books.books.filter(book => book.status === 'reading');

export const selectFilteredBooks = (state) => {
  const { books } = state.books;
  const { search, category, status } = state.books.filters;

  return books.filter(book => {
    const matchesSearch = !search || 
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'All' || book.category === category;
    
    const matchesStatus = status === 'All' || book.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
};

export const selectCategories = (state) => {
  const categories = [...new Set(state.books.books.map(book => book.category))];
  return categories.filter(category => category);
};

export const selectStatusTypes = (state) => {
  return ['reading', 'borrow', 'sale'];
};

// Export all actions
export const {
  addBook,
  borrowBook,
  sellBook,
  markAsRead,
  updateBook,
  deleteBook,
  setEditBook,
  clearEditBook,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = booksSlice.actions;

export default booksSlice.reducer;