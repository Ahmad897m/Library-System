// src/services/localStorageService.js
class LocalStorageService {
    constructor() {
        this.STORAGE_KEYS = {
            BOOKS: 'library_books',
            CUSTOMERS: 'library_customers',
            TRANSACTIONS: 'library_transactions',
            SETTINGS: 'library_settings'
        };
    }

    // ✅ توليد ID فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ---------------- الكتب ----------------
    getBooks() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BOOKS)) || [];
        } catch (error) {
            console.error('Error reading books:', error);
            return [];
        }
    }

    saveBooks(books) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.BOOKS, JSON.stringify(books));
        } catch (error) {
            console.error('Error saving books:', error);
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
            const processedUpdates = {};
            Object.keys(updates).forEach(key => {
                if (typeof updates[key] === 'function') {
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

    // ---------------- العملاء ----------------
    getCustomers() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CUSTOMERS)) || [];
        } catch (error) {
            console.error('Error reading customers:', error);
            return [];
        }
    }

    saveCustomers(customers) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
        } catch (error) {
            console.error('Error saving customers:', error);
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
        const index = customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updates };
            this.saveCustomers(customers);
            return customers[index];
        }
        return null;
    }

    // ---------------- المعاملات ----------------
    getTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS)) || [];
        } catch (error) {
            console.error('Error reading transactions:', error);
            return [];
        }
    }

    saveTransactions(transactions) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        } catch (error) {
            console.error('Error saving transactions:', error);
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
        return this.getTransactions().filter(t => t.action === type);
    }

    getTransactionsByCustomer(customerId) {
        return this.getTransactions().filter(t => t.customerId === customerId);
    }

    getTransactionsByBook(bookId) {
        return this.getTransactions().filter(t => t.bookId === bookId);
    }

    // ---------------- الإحصائيات ----------------
    getLibraryStats() {
        const books = this.getBooks();
        const transactions = this.getTransactions();

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

    // ---------------- الإعدادات ----------------
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) || {
                borrowPrices: { "2": 0.10, "7": 0.20, "15": 0.25 },
                currency: 'USD',
                language: 'ar'
            };
        } catch (error) {
            console.error('Error reading settings:', error);
            return {};
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        this.saveSettings(updated);
        return updated;
    }

    // ---------------- أدوات مساعدة ----------------
    calculateBorrowPrice(bookPrice, borrowPeriod) {
        const settings = this.getSettings();
        const percentage = settings.borrowPrices?.[borrowPeriod] || 0.10;
        return (parseFloat(bookPrice) * percentage).toFixed(2);
    }

    cleanupOldData(daysToKeep = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysToKeep);

        const recent = this.getTransactions().filter(t => new Date(t.timestamp) >= cutoff);
        this.saveTransactions(recent);
    }
}

export const localStorageService = new LocalStorageService();
