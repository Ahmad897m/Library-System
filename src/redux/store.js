import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/bookSlice';
import customersReducer from './slices/customerSlice';
import transactionsReducer from './slices/transactionsSlice';
import statsReducer from './slices/statsSlice';
import passwordReducer from './slices/passwordSlice'

export const store = configureStore({
  reducer: {
    books: booksReducer,
    customers: customersReducer,
    transactions: transactionsReducer,
    stats: statsReducer,
    password: passwordReducer,

  },
});

export default store;

