import express, { Request, Response } from 'express';
import { HistoryRecord, Movie } from '../type/VideoType';
import fetch, { Response as FetchResponse } from 'node-fetch';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

const historyDatabase: HistoryRecord[] = [];

// 영화 목록 조회 API
app.get('/api/movies', async (req: Request, res: Response) => {
  try {
    const url = '/movies';

    const response: FetchResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    });

    if (!response.ok) {
      throw new Error('영화 목록을 불러오지 못했습니다.');
    }

    const movieData = await response.json();
    res.json({ movies: movieData });
  } catch (error:unknown) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시청 기록 저장 API
app.post('/api/history', async (req: Request, res: Response) => {
  try {
    const { userID, movieID, lastPosition } = req.body;

    const historyRecord: HistoryRecord = {
      userID,
      movieID,
      lastPosition,
      timestamp: new Date(),
    };

    historyDatabase.push(historyRecord);

    const accessToken = req.cookies.access_token || '';

    const url = '/history';

    const response: FetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '69420',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(historyRecord),
    });

    if (!response.ok) {
      throw new Error('시청 기록을 저장하지 못했습니다.');
    }

    res.json({ message: '시청 기록 저장에 성공했어요' });
  } catch (error:unknown) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버 작동 중입니다. 포트: ${port}`);
});