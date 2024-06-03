import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import Variants from './pages/variants/variants.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/variants/:Id' element={<Variants />} />
    </Routes>
  )
}

export default App