// Load initial data from db.json (this would happen once at app startup)
const loadInitialData = () => {
  // Check if we already have data in localStorage
  if (!localStorage.getItem('books') && !localStorage.getItem('customers')) {
    // Set empty arrays as initial data
    localStorage.setItem('books', JSON.stringify([]));
    localStorage.setItem('customers', JSON.stringify([]));
  }
};

// Books API
export const getBooks = () => {
  return JSON.parse(localStorage.getItem('books') || '[]');
};

export const addBook = (book) => {
  const books = getBooks();
  const newBook = {
    ...book,
    id: Date.now(), // Simple way to generate unique IDs
  };
  books.push(newBook);
  localStorage.setItem('books', JSON.stringify(books));
  return newBook;
};

export const updateBook = (id, updatedBook) => {
  const books = getBooks();
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    localStorage.setItem('books', JSON.stringify(books));
    return books[index];
  }
  return null;
}



    deleteBook(bookId) {
        const books = this.getBooks();
        const filteredBooks = books.filter(book => book.id !== bookId);
        this.saveBooks(filteredBooks);
    }

    // عملاء
    getCustomers() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CUSTOMERS)) || [];
        } catch (error) {
            console.error('Error reading customers from localStorage:', error);
            return [];
        }
    }

    saveCustomers(customers) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
        } catch (error) {
            console.error('Error saving customers to localStorage:', error);
        }
    }

    addCustomer(customer) {
        const customers = this.getCustomers();
        const newCustomer = {
            ...customer,
            id: customer.id || this.generateId(),
            joinDate: customer.joinDate || new Date().toISOString().split('T')[0],
            totalLoans: customer.totalLoans || 0,
            totalPurchases: customer.totalPurchases || 0,
            totalReadings: customer.totalReadings || 0
        };
        customers.push(newCustomer);
        this.saveCustomers(customers);
        return newCustomer;
    }

    updateCustomer(customerId, updates) {
        const customers = this.getCustomers();
        const index = customers.findIndex(customer => customer.id === customerId);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updates };
            this.saveCustomers(customers);
            return customers[index];
        }
        return null;
    }

    // معاملات
    getTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS)) || [];
        } catch (error) {
            console.error('Error reading transactions from localStorage:', error);
            return [];
        }
    }

    saveTransactions(transactions) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        } catch (error) {
            console.error('Error saving transactions to localStorage:', error);
        }
    }

    addTransaction(transaction) {
        const transactions = this.getTransactions();
        const newTransaction = {
            ...transaction,
            id: transaction.id || this.generateId(),
            timestamp: transaction.timestamp || new Date().toISOString(),
            price: parseFloat(transaction.price) || 0,
            amountPaid: parseFloat(transaction.amountPaid) || 0
        };
        transactions.push(newTransaction);
        this.saveTransactions(transactions);
        return newTransaction;
    }

    getTransactionsByType(type) {
        const transactions = this.getTransactions();
        return transactions.filter(transaction => transaction.action === type);
    }

    getTransactionsByCustomer(customerId) {
        const transactions = this.getTransactions();
        return transactions.filter(transaction => transaction.customerId === customerId);
    }

    getTransactionsByBook(bookId) {
        const transactions = this.getTransactions();
        return transactions.filter(transaction => transaction.bookId === bookId);
    }

    // إحصائيات
    getLibraryStats() {
        const books = this.getBooks();
        const transactions = this.getTransactions();
        const customers = this.getCustomers();

        const borrowedBooks = books.filter(book => book.status === 'borrow' && book.copies > 0).length;
        const soldBooks = transactions.filter(t => t.action === 'Buy').length;
        const readBooks = transactions.filter(t => t.action === 'Read').length;

        const incomeFromSales = transactions
            .filter(t => t.action === 'Buy')
            .reduce((total, t) => total + (parseFloat(t.price) || 0), 0);

        const incomeFromBorrow = transactions
            .filter(t => t.action === 'Borrow')
            .reduce((total, t) => total + (parseFloat(t.price) || 0), 0);

        const uniqueCustomers = new Set(transactions.map(t => t.customerId)).size;

        return {
            totalBooks: books.length,
            borrowedBooks,
            soldBooks,
            readInLibrary: readBooks,
            customersServed: uniqueCustomers,
            monthlyIncome: incomeFromSales + incomeFromBorrow,
            incomeFromSales,
            incomeFromBorrow
        };
    }

    // إعدادات
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) || {
                borrowPrices: {
                    "2": 0.10,
                    "7": 0.20,
                    "15": 0.25
                },
                currency: 'USD',
                language: 'ar'
            };
        } catch (error) {
            console.error('Error reading settings from localStorage:', error);
            return {};
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
        }
    }

    updateSettings(newSettings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        this.saveSettings(updatedSettings);
        return updatedSettings;
    }

    // أدوات مساعدة
    calculateBorrowPrice(bookPrice, borrowPeriod) {
        const settings = this.getSettings();
        const percentage = settings.borrowPrices?.[borrowPeriod] || 0.10;
        return (parseFloat(bookPrice) * percentage).toFixed(2);
    }

    // تنظيف البيانات القديمة (اختياري)
    cleanupOldData(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const transactions = this.getTransactions();
        const recentTransactions = transactions.filter(transaction => {
            return new Date(transaction.timestamp) >= cutoffDate;
        });

        this.saveTransactions(recentTransactions);
    }
}

export const localStorageService = new LocalStorageService();