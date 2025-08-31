import { createSlice } from '@reduxjs/toolkit';
import { localStorageService } from '../../services/localStorageService';

const initialState = {
  transactions: localStorageService.getTransactions(),
  loading: false,
  error: null,
  filters: {
    type: 'All',
    search: '',
  },
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // إضافة معاملة جديدة
    addTransaction: (state, action) => {
      const transactions = state.transactions;
      const newTransaction = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      transactions.push(newTransaction);
      localStorageService.saveTransactions(transactions);
      state.transactions = transactions;
    },
    
    // تحديث معاملة (لإرجاع الكتاب)
    updateTransaction: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updates };
        localStorageService.saveTransactions(state.transactions);
      }
    },
    
    // تعيين عوامل التصفية
    setTransactionFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // مسح عوامل التصفية
    clearTransactionFilters: (state) => {
      state.filters = {
        type: 'All',
        search: '',
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

export const {
  addTransaction,
  updateTransaction,
  setTransactionFilters,
  clearTransactionFilters,
  setLoading,
  setError,
} = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state) => state.transactions.transactions;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionFilters = (state) => state.transactions.filters;

// Selector للحصول على الإعارات النشطة (الاقتراض فقط)
export const selectActiveLoans = (state) => {
  return state.transactions.transactions.filter(transaction => 
    transaction.action === 'Borrow' && 
    !transaction.returned &&
    transaction.borrowDate && // تأكد من وجود حقول الإعارة
    transaction.returnDate &&
    transaction.borrowPeriod
  );
};

// Selector للحصول على الإعارات المنتهية (الاقتراض فقط)
export const selectExpiredLoans = (state) => {
  return state.transactions.transactions.filter(transaction => {
    if (transaction.action !== 'Borrow' || 
        transaction.returned ||
        !transaction.borrowDate ||
        !transaction.returnDate) {
      return false;
    }
    
    const returnDate = new Date(transaction.returnDate);
    const now = new Date();
    return now > returnDate;
  });
};

// Selector لجلسات القراءة النشطة فقط
export const selectActiveReadingSessions = (state) => {
  return state.transactions.transactions.filter(transaction => 
    transaction.action === 'Read' && 
    transaction.status === 'active_reading' &&
    // تأكد من عدم وجود حقول الإعارة (لتفادي الازدواجية)
    !transaction.borrowDate &&
    !transaction.returnDate &&
    !transaction.borrowPeriod
  );
};

// Selector جديد: إحصائيات المعاملات
export const selectTransactionStats = (state) => {
  const transactions = state.transactions.transactions;
  
  return {
    total: transactions.length,
    read: transactions.filter(t => t.action === 'Read').length,
    buy: transactions.filter(t => t.action === 'Buy').length,
    borrow: transactions.filter(t => t.action === 'Borrow').length,
    returned: transactions.filter(t => t.returned).length,
    active: transactions.filter(t => t.action === 'Borrow' && !t.returned).length
  };
};

export const selectFilteredTransactions = (state) => {
  const { transactions } = state.transactions;
  const { type, search } = state.transactions.filters;

  return transactions.filter(transaction => {
    const matchesType = type === 'All' || transaction.action === type;
    const matchesSearch = !search || 
      transaction.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      transaction.bookTitle?.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });
};

export default transactionsSlice.reducer;