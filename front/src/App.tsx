import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/main';
import GenrePage from './page/GenreVideo';
import Historypage from './page/History';
import Movie from './page/Movie';
import Header from './component/header';
import Login from './component/Login';
import MovieEdit from './page/MovieEdit';
import MovieAdd from './page/Movieadd';
import Signup from './page/Signup';
import CustomerForm from './page/MyACCount';
import UserProfile from './page/MemberList';
import SearchResults from './page/search';

function App() {
  return (
      <BrowserRouter>
      <Header/>
       <nav>
         <Routes>
           <Route path='/' element={<Home/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path='/stream/:movieId' element={<Movie/>}/>
           <Route path='/genres/:genre' element={<GenrePage />}/>
           <Route path='/history' element={<Historypage/>}/>
           <Route path='/mypage/edit' element={<CustomerForm/>}/>
           <Route path='/signup' element={<Signup/>}/>
           <Route path='/movie/edit/:movieId' element={<MovieEdit/>}/>
           <Route path='/movie/add' element={<MovieAdd/>}/>
           <Route path='/mypage' element={<UserProfile/>}/>
           <Route path='/movie/search' element={<SearchResults />} />
         </Routes>
       </nav>
      </BrowserRouter>
  );
}

export default App;
