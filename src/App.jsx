import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className='app'>
      <Header />
      <div className="Home" style={{ display: 'flex', flexWrap:'nowrap'}}>
      <Sidebar />
      <div className="pages" style={{width:'75%'}}>
      <Dashboard />
      </div>
      </div>
      
    </div>
  );
}

export default App;
