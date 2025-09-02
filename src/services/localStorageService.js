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
};

export const deleteBook = (id) => {
  const books = getBooks();
  const filteredBooks = books.filter(book => book.id !== id);
  localStorage.setItem('books', JSON.stringify(filteredBooks));
};

// Customers API
export const getCustomers = () => {
  return JSON.parse(localStorage.getItem('customers') || '[]');
};

export const addCustomer = (customer) => {
  const customers = getCustomers();
  const newCustomer = {
    ...customer,
    id: Date.now(),
  };
  customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));
  return newCustomer;
};

// Initialize the service
export const initializeStorage = () => {
  loadInitialData();
};