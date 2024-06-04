import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import BookSearch from './components/BookSearch';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className="App">

      <BookSearch/>
      {/* <Routes>
      <Route path="/" element={<BookSearch/>}></Route>
        </Routes> */}
    </div>
  );
}

export default App;
