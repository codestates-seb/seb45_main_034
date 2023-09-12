package com.seb_main_034.SERVER.moviesearch.service;

import com.seb_main_034.SERVER.moviesearch.dto.MovieSearchDTO;
import com.seb_main_034.SERVER.moviesearch.repository.MovieSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieSearchService {
    @Autowired
    private MovieSearchRepository movieSearchRepository;

    public List<String> searchMovies(MovieSearchDTO movieSearchDTO) {
        String keyword = movieSearchDTO.getKeyword();
        String field = movieSearchDTO.getField();

        if ("title".equals(field)) {
            return movieSearchRepository.searchMoviesByTitle(keyword);
        } else if ("genre".equals(field)) {
            return movieSearchRepository.searchMoviesByGenre(keyword);
        } else {
            // Fallback: Search both fields if 'field' is not specified or invalid.
            return movieSearchRepository.searchMoviesByField(keyword);
        }
    }
}

