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
import MovieEdit from './page/MovieEdit';
import MovieAdd from './page/Movieadd';
import Signup from './page/Signup';
import CustomerForm from './page/MyACCount';
import UserProfile from './page/MemberList';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  return (
      <BrowserRouter>
      <Header/>
      <div className='app-container'>
      <SideBar setSelectedCategory={setSelectedCategory} />
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
         </Routes>
       </nav>
      </div>
      </BrowserRouter>
  );
}

export default App;
