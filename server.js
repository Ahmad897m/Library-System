const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read the database file
const getDbData = () => {
  const rawData = fs.readFileSync(path.join(__dirname, "db.json"));
  return JSON.parse(rawData);
};

// Save to database file
const saveDbData = (data) => {
  fs.writeFileSync(
    path.join(__dirname, "db.json"),
    JSON.stringify(data, null, 2)
  );
};

// API Routes

// Get all books
app.get("/api/books", (req, res) => {
  const data = getDbData();
  res.json(data.books);
});

// Get a single book
app.get("/api/books/:id", (req, res) => {
  const data = getDbData();
  const book = data.books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Create a new book
app.post("/api/books", (req, res) => {
  const data = getDbData();
  const newBook = req.body;
  newBook.id = Date.now().toString();
  data.books.push(newBook);
  saveDbData(data);
  res.status(201).json(newBook);
});

// Update a book
app.put("/api/books/:id", (req, res) => {
  const data = getDbData();
  const index = data.books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  
  const updatedBook = { ...data.books[index], ...req.body };
  data.books[index] = updatedBook;
  saveDbData(data);
  res.json(updatedBook);
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
  const data = getDbData();
  const index = data.books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  
  data.books.splice(index, 1);
  saveDbData(data);
  res.status(204).end();
});

// Get all customers
app.get("/api/customers", (req, res) => {
  const data = getDbData();
  res.json(data.customers);
});

// Get a single customer
app.get("/api/customers/:id", (req, res) => {
  const data = getDbData();
  const customer = data.customers.find((c) => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

// Create a new customer
app.post("/api/customers", (req, res) => {
  const data = getDbData();
  const newCustomer = req.body;
  newCustomer.id = Date.now().toString().slice(-4);
  data.customers.push(newCustomer);
  saveDbData(data);
  res.status(201).json(newCustomer);
});

// Update a customer
app.put("/api/customers/:id", (req, res) => {
  const data = getDbData();
  const index = data.customers.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Customer not found" });
  
  const updatedCustomer = { ...data.customers[index], ...req.body };
  data.customers[index] = updatedCustomer;
  saveDbData(data);
  res.json(updatedCustomer);
});

// Delete a customer
app.delete("/api/customers/:id", (req, res) => {
  const data = getDbData();
  const index = data.customers.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Customer not found" });
  
  data.customers.splice(index, 1);
  saveDbData(data);
  res.status(204).end();
});

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  
  // Fix for path-to-regexp error in Express 5.1.0
  // Using regex pattern instead of wildcard "*"
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  // In development, just show a simple message
  app.get("/", (req, res) => {
    res.send("API server is running. Access API at /api/books or /api/customers");
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
