import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Historys } from '../type/VideoType';
import '../component/CSS/History.css'

const Historypage: React.FC = () => {
    const [history, setHistory] = useState<Historys[]>([]);

    useEffect(() => {
        axios.get<Historys[]>('/api/history')
        .then((response) => {
            const sortedHistory = response.data.reverse();
            setHistory(sortedHistory);
        })
        .catch((error: unknown) => {
            console.error('시청목록을 불러오는데 실패했어요.', error)
        });
    },[]);
    return (
        <main className='history-page'>
            <h2>시청 기록</h2>
            <div className='history-list'>
                {history.map((record) => (
                    <div key={record.movieID} className='history-item'>
                        <p>{record.movieTitle}</p>
                        <p>{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </main>
    )

}

export default Historypage;