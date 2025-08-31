// src/services/localStorageService.js
class LocalStorageService {
    constructor() {
        this.STORAGE_KEYS = {
            BOOKS: 'library_books',
            CUSTOMERS: 'library_customers',
            TRANSACTIONS: 'library_transactions',
            SETTINGS: 'library_settings'
        };
        
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        if (!this.getBooks().length) {
            const defaultBooks = [
                {
                    id: this.generateId(),
                    title: 'مقدمة في علوم الحاسوب',
                    author: 'أحمد محمد',
                    publishedDate: '2023-01-15',
                    category: 'علوم الحاسوب',
                    status: 'borrow',
                    price: 29.99,
                    copies: 5,
                    description: 'كتاب تمهيدي في علوم الحاسوب',
                    addedDate: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: 'تعلم البرمجة بلغة JavaScript',
                    author: 'سارة عبدالله',
                    publishedDate: '2023-03-20',
                    category: 'برمجة',
                    status: 'sale',
                    price: 35.50,
                    copies: 3,
                    description: 'دليل شامل لتعلم JavaScript',
                    addedDate: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: 'القصص العربية الكلاسيكية',
                    author: 'محمد علي',
                    publishedDate: '2022-11-10',
                    category: 'أدب',
                    status: 'reading',
                    price: 0,
                    copies: 1,
                    description: 'مجموعة من القصص العربية التقليدية',
                    addedDate: new Date().toISOString()
                }
            ];
            this.saveBooks(defaultBooks);
        }

        if (!this.getTransactions().length) {
            const defaultTransactions = [];
            this.saveTransactions(defaultTransactions);
        }

        if (!this.getCustomers().length) {
            const defaultCustomers = [];
            this.saveCustomers(defaultCustomers);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // كتب
    getBooks() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKS)) || [];
        } catch (error) {
            console.error('Error reading books from localStorage:', error);
            return [];
        }
    }

    saveBooks(books) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.BOOKS, JSON.stringify(books));
        } catch (error) {
            console.error('Error saving books to localStorage:', error);
        }
    }

    addBook(book) {
        const books = this.getBooks();
        const newBook = {
            ...book,
            id: book.id || this.generateId(),
            addedDate: book.addedDate || new Date().toISOString(),
            status: book.status || 'borrow',
            copies: parseInt(book.copies) || 1,
            price: parseFloat(book.price) || 0
        };
        books.push(newBook);
        this.saveBooks(books);
        return newBook;
    }





    updateBook(bookId, updates) {
      const books = this.getBooks();
  const index = books.findIndex(book => book.id === bookId);
  if (index !== -1) {
    // إذا كانت updates تحتوي على دالة، ننفذها للحصول على القيمة الجديدة
    const processedUpdates = {};
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'function') {
        // إذا كانت قيمة دالة، ننفذها مع القيمة الحالية
        processedUpdates[key] = updates[key](books[index][key]);
      } else if (key === 'copies') {
        processedUpdates[key] = parseInt(updates[key]);
      } else if (key === 'price') {
        processedUpdates[key] = parseFloat(updates[key]);
      } else {
        processedUpdates[key] = updates[key];
      }
    });

    books[index] = { ...books[index], ...processedUpdates };
    this.saveBooks(books);
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
