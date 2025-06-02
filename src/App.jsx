import React, { useState } from 'react';
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

function App() {

  // بيانات وهمية للتجريب
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      internalReadOnly: true,
      isForSale: true,
      isBorrowable: false,
      price: 10,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-help",
      internalReadOnly: true,
      isForSale: true,
      isBorrowable: true,
      price: 15,
    },
    {
      id: 3,
      title: "The Pragmatic Programmer",
      author: "Andy Hunt",
      category: "Technology",
      internalReadOnly: false,
      isForSale: true,
      isBorrowable: true,
      price: 20,
    }
  ]);

  const [customersLog, setCustomersLog] = useState([]);

  //  لإضافة زبون جديد
  const addCustomerLog = (newEntry) => {
    setCustomersLog((prev) => [
      ...prev,
      { id: prev.length + 1, ...newEntry },
    ]);
  };


  return (
    <div className='app'>
      <Header />
      <div className="Home" style={{ display: 'flex', flexWrap:'nowrap'}}>
      <Sidebar />
      <div className="pages" style={{width:'75%'}}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/AddNewBook' element={<AddBook />} />
          <Route path='/BookManagement' element={<BooksManagement />} />
          <Route path='/Issue-Return' element={<IssueBook   addCustomerLog={addCustomerLog} />} />
          <Route path='/ReadingRoom' element={<ReadingOnly books = {books}   addCustomerLog={addCustomerLog} />} />
          <Route path='/Sales' element={<Sales books = {books}   addCustomerLog={addCustomerLog} />} />
          <Route path='/Customers' element={<Customer   customersLog={customersLog} />} />
          <Route path='/Notifications' element={<Notifications   customersLog={customersLog} />} />

        </Routes>
      </div>
      </div>
      
    </div>
  );
}

export default App;
