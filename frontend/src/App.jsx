import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import Variants from './pages/variants/variants.jsx';
import About from './pages/about/about.jsx';
import Contact from './pages/contact/contact.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/variants/:Id' element={<Variants />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
    </Routes>
  )
}

export default App