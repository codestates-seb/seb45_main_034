import express, { Request, Response } from 'express';
import { HistoryRecord, Movie } from '../type/VideoType';

const historyDatabase: HistoryRecord[] = [];

// 영화 목록 조회 API
export const fetchMovies = async () => {
  try {
    const response = await fetch('https://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080/api/movies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('영화 목록을 불러오지 못했습니다.');
    }

    const data:any = await response.json();
    console.log('영화 목록:', data.movies);
  } catch (error) {
    console.error('GET 요청 오류:', error);
  }
}

// 영화 삭제 API
export const deleteMovie = async (movieID: number) => {
  try {
    const response = await fetch(`https://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080/api/movies/${movieID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('영화 삭제에 실패했습니다.');
    }

    console.log('영화 삭제 성공');
  } catch (error) {
    console.error('DELETE 요청 오류:', error);
  }
}

// 시청 기록 저장 API
export const saveWatchHistory = async (userID: number, movieID: number, lastPosition: number) => {
  try {
    const requestData = {
      userID,
      movieID,
      lastPosition,
    };

    const response = await fetch('https://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('시청 기록을 저장하지 못했습니다.');
    }

    const responseData:any = await response.json();
    console.log(responseData.message);
  } catch (error) {
    console.error('POST 요청 오류:', error);
  }
}