import React, { useState, useEffect } from 'react';
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Login from './components/login/Login';

function App() {


  // mode

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});

const toggleDarkMode = () => {
  setDarkMode(prev => {
    const newMode = !prev;
    localStorage.setItem('darkMode', newMode);
    return newMode;
  });
};


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [customersLog, setCustomersLog] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  const handleLogin = (status) => setIsLoggedIn(status);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  const addCustomerLog = (customer) => setCustomersLog(prev => [...prev, customer]);

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner">📚</div>
      <p>جاري التحميل...</p>
    </div>
  );

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
<div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header onLogout={handleLogout} />
      <div className="Home" style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <Sidebar onLogout={handleLogout} />
        <div className="pages" style={{ width: '75%' }}>
          <Routes>
            <Route path='/' element={<Navigate to="/dashboard" replace />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/AddNewBook' element={<AddBook />} />
            <Route path='/AddNewCustomer' element={<AddNewCustomer />} />
            <Route path='/BookManagement' element={<BooksManagement />} />
            <Route path='/Issue-Return' element={<IssueBook addCustomerLog={addCustomerLog} />} />
            <Route path='/ReadingRoom' element={<ReadingOnly books={books} addCustomerLog={addCustomerLog} />} />
            <Route path='/Sales' element={<Sales books={books} addCustomerLog={addCustomerLog} />} />
            <Route path='/Customers' element={<Customer customersLog={customersLog} />} />
            <Route path='/Notifications' element={<Notifications customersLog={customersLog} />} />
            <Route path='/Settings' element={<SettingsPage toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
