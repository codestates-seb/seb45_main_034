import React, { useState } from 'react';
import './Sidebar.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/main';
import GenrePage from './component/GenreVideo';
import SideBar from './component/Sidebar';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  return (
      <BrowserRouter>
      <SideBar setSelectedCategory={setSelectedCategory} />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/api/stream/:movieID' element={''}/>
          <Route
          path='/genres/:genre'
          element={<GenrePage genre={selectedCategory} />}
        />
          <Route path='/history' element={''}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
