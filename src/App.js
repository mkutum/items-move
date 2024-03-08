import React from 'react';
import './App.css';
import ItemList from './components/ItemList'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className='main-div'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ItemList />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App;
