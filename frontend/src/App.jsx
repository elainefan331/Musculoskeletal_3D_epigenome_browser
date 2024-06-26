import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.jsx';
import Variants from './pages/variants/variants.jsx';
import Genes from './pages/genes/genes.jsx';
import Diseases from './pages/diseases/diseases.jsx';
import DiseaseIndex from './pages/diseaseIndex/diseaseIndex.jsx';
import About from './pages/about/about.jsx';
import Contact from './pages/contact/contact.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/variants/:Id' element={<Variants />} />
      <Route path='/genes/:Id' element={<Genes />} />
      <Route path='/diseases/:Id' element={<Diseases />} />
      <Route path='/indexSNP/:Id' element={<DiseaseIndex />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
    </Routes>
  )
}

export default App