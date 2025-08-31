import { createSlice } from '@reduxjs/toolkit';
import { localStorageService } from '../../services/localStorageService';

const initialState = {
  stats: {
    totalBooks: 0,
    borrowedBooks: 0,
    soldBooks: 0,
    readInLibrary: 0,
    customersServed: 0,
    monthlyIncome: 0,
  },
  recentBooks: [],
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStats: (state) => {
      const books = localStorageService.getBooks();
      const transactions = localStorageService.getTransactions();
      
      const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
      const soldTransactions = transactions.filter(t => t.action === 'Buy').length;
      const readTransactions = transactions.filter(t => t.action === 'Read').length;
      const uniqueCustomers = new Set(transactions.map(t => t.customerId)).size;
      
      const income = transactions
        .filter(t => t.action === 'Buy')
        .reduce((total, transaction) => total + (transaction.price || 0), 0);

      state.stats = {
        totalBooks: books.length,
        borrowedBooks,
        soldBooks: soldTransactions,
        readInLibrary: readTransactions,
        customersServed: uniqueCustomers,
        monthlyIncome: income,
      };

      // أحدث 3 كتب مضافة
      state.recentBooks = books
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 3);
    },
  },
});

export const { updateStats } = statsSlice.actions;

export const selectStats = (state) => state.stats.stats;
export const selectRecentBooks = (state) => state.stats.recentBooks;

export default statsSlice.reducer;