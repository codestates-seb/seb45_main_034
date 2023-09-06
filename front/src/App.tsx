import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/main';
import GenrePage from './page/GenreVideo';
import SideBar from './component/Sidebar';
import Historypage from './page/History';
import Movie from './page/Movie';
import Header from './component/header';
import Login from './component/Login';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  return (
      <BrowserRouter>
      <Header/>
      <div className='app-container'>
      <SideBar setSelectedCategory={setSelectedCategory} />
       <nav>
         <Routes>
           <Route path='/' element={<Home/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path='/api/stream/:movieID' element={<Movie/>}/>
           <Route path='/genres/:genre' element={<GenrePage />}/>
           <Route path='/history' element={<Historypage/>}/>
         </Routes>
       </nav>
      </div>
      </BrowserRouter>
  );
}

export default App;
