import React, { useState, useEffect } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AddBook from './components/AddBook/AddBook';
import BooksManagement from './components/BooksManagmenet/BooksManagmenets';
import IssueBook from './components/IssueBook/IssueBook';
import ReadingOnly from './components/ReadingOnly/ReadingOnly';
import Sales from './components/Sales/Sales';
import Customer from './components/Customers/Customer';
import Notifications from './components/Notifications/Notifications';
import AddNewCustomer from './components/AddNewCustomer/AddNewCustomer';
import SettingsPage from './components/settings/Settings';
import { getBooks, getCustomers, addCustomer } from './services/apiService';

function App() {
  const [books, setBooks] = useState([]);
  const [customersLog, setCustomersLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books and customers from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
        
        const customersData = await getCustomers();
        setCustomersLog(customersData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add customer log to API
  const addCustomerLog = async (newEntry) => {
    try {
      const customerData = {
        ...newEntry,
        id: Date.now(), // Generate a unique ID
        date: new Date().toISOString() // Add timestamp
      };
      
      // Add to API
      const addedCustomer = await addCustomer(customerData);
      
      // Update local state
      setCustomersLog(prev => [...prev, addedCustomer]);
    } catch (error) {
      console.error("Error adding customer log:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className='app'>
      <Header />
      <div className="Home" style={{ display: 'flex', flexWrap:'nowrap'}}>
      <Sidebar />
      <div className="pages" style={{width:'75%'}}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/AddNewBook' element={<AddBook />} />
          <Route path='/AddNewCustomer' element={<AddNewCustomer />} />
          <Route path='/BookManagement' element={<BooksManagement />} />
          <Route path='/Issue-Return' element={<IssueBook addCustomerLog={addCustomerLog} books={books} />} />
          <Route path='/ReadingRoom' element={<ReadingOnly books={books} addCustomerLog={addCustomerLog} />} />
          <Route path='/Sales' element={<Sales books={books} addCustomerLog={addCustomerLog} />} />
          <Route path='/Customers' element={<Customer customersLog={customersLog} />} />
          <Route path='/Notifications' element={<Notifications customersLog={customersLog} />} />
          <Route path='/Settings' element={<SettingsPage customersLog={customersLog} />} />
        </Routes>
      </div>
      </div>
    </div>
  );
}

export default App;
