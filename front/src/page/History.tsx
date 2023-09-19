import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Historys } from '../type/VideoType';
import '../component/CSS/History.css'
import Cookies from 'js-cookie';
import SideBar from '../component/Sidebar';

const instance = axios.create({
    baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
  });
  
  instance.interceptors.request.use((config) => {
    const accessToken = Cookies.get("accessToken");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  
    return config;
  });

  const Historypage: React.FC = () => {
    const [history, setHistory] = useState<Historys[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const userId = Cookies.get("userId")

    useEffect(() => {
        instance.get<Historys[]>(`/api/watch-history/user/${userId}`)
        .then((response) => {
        })
        .catch((error: unknown) => {
            console.error('시청 기록을 불러오는데 실패했어요.', error)
        });
    }, []);

    return (
        <div className='app-container'>
        <SideBar setSelectedCategory={setSelectedCategory} />
        <main className='history-page'>
            <h2 className='history-font'>시청 기록</h2>
            <div className='history-list'>
                {history.map((record) => (
                    <div key={record.movieID} className='history-item'>
                        <p>{record.movieTitle}</p>
                        <p>{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </main>
        </div>
    )
}

export default Historypage;