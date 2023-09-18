import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaClock, FaFilter } from 'react-icons/fa';
import './CSS/button.css'

interface SideBarProps {
  setSelectedCategory: (category: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState<boolean>(false);

  const handleHomeClick = () => {
    setSelectedCategory('');
    navigate('/');
  };

  const handleCategoriesClick = () => {
    setShowCategories(!showCategories);
  };

  const handleGenreClick = (genre: string) => {
    setSelectedCategory(genre);
    navigate(`/genres/${genre}`);
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  return (
    <aside className="sidebar">
      <button onClick={handleHomeClick} className="home-button">
        <FaHome className="home-icon" />
        <span className="home-text">홈</span>
      </button>
      <button onClick={handleCategoriesClick}>
        <FaFilter className="filter-icon" />
        <span className='filter-text'>카테고리</span>
      </button>
      <div className={`side-list ${showCategories ? 'show' : ''}`}>
      <button onClick={() => handleGenreClick('액션')}>액션</button>
        <button onClick={() => handleGenreClick('드라마')}>드라마</button>
      </div>
      <button onClick={handleHistoryClick}>
        <FaClock className="history-icon" />
        <span className="history-text">시청 기록</span>
      </button>
    </aside>
  );
};

export default SideBar;