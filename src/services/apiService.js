const API_URL = process.env.REACT_APP_API_URL;

// Books API
export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  return response.json();
};

export const addBook = async (book) => {
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const updateBook = async (id, updatedBook) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBook),
  });
  return response.json();
};

export const deleteBook = async (id) => {
  await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });
};

// Customers API
export const getCustomers = async () => {
  const response = await fetch(`${API_URL}/customers`);
  return response.json();
};

export const addCustomer = async (customer) => {
  const response = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const updateCustomer = async (id, updatedCustomer) => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCustomer),
  });
  return response.json();
};

export const deleteCustomer = async (id) => {
  await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
  });
};
