import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import BookSearch from './components/BookSearch';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookSales from './components/BookSales';
import BookMain from './pages/BookMain';
import SalesPage from './pages/SalesPage';

function App() {

  return (
    <div className="App">

    
      <Routes>
        <Route path="/" element ={<BookMain/>}/>
        <Route path="/search" element ={<BookSearch/>}/>
        <Route path="/sales" element={<BookSales />} />
      </Routes>

      
    </div>
  );
}

export default App;
