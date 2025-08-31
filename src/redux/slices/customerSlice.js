import { createSlice } from '@reduxjs/toolkit';
import { localStorageService } from '../../services/localStorageService';

const initialState = {
  customers: localStorageService.getCustomers(),
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // إضافة عميل جديد
    addCustomer: (state, action) => {
      const newCustomer = localStorageService.addCustomer(action.payload);
      state.customers.push(newCustomer);
    },
    
    // تحديث عميل
    updateCustomer: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.customers.findIndex(customer => customer.id === id);
      if (index !== -1) {
        state.customers[index] = { ...state.customers[index], ...updates };
        localStorageService.saveCustomers(state.customers);
      }
    },
    
    // إرجاع كتاب (زيادة عدد النسخ)
    returnBook: (state, action) => {
      const { customerId, bookId } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      
      if (customer) {
        // تقليل عدد الإعارات النشطة للعميل
        customer.activeLoans = Math.max(0, (customer.activeLoans || 0) - 1);
        localStorageService.saveCustomers(state.customers);
      }
    },
    
    // حذف عميل
    deleteCustomer: (state, action) => {
      const id = action.payload;
      state.customers = state.customers.filter(customer => customer.id !== id);
      localStorageService.saveCustomers(state.customers);
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
  addCustomer,
  updateCustomer,
  returnBook,
  deleteCustomer,
  setLoading,
  setError,
} = customersSlice.actions;

// Selectors
export const selectCustomers = (state) => state.customers.customers;
export const selectCustomersLoading = (state) => state.customers.loading;
export const selectCustomersError = (state) => state.customers.error;

// Selector للحصول على العملاء مع إعارات نشطة
export const selectCustomersWithActiveLoans = (state) => {
  return state.customers.customers.filter(customer => 
    customer.activeLoans > 0
  );
};

export default customersSlice.reducer;