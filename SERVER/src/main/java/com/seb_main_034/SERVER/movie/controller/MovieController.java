package com.seb_main_034.SERVER.movie.controller;

import com.seb_main_034.SERVER.movie.dto.MoviePatchDto;
import com.seb_main_034.SERVER.movie.dto.MoviePostDto;
import com.seb_main_034.SERVER.movie.dto.MovieResponseDto;
import com.seb_main_034.SERVER.movie.entity.Movie;
import com.seb_main_034.SERVER.movie.mapper.MovieMapper;
import com.seb_main_034.SERVER.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@Validated
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;
    private final MovieMapper movieMapper;

    //영화 정보 등록
    @PostMapping
    public ResponseEntity postMovie(@Valid @RequestBody MoviePostDto moviePostDto,
                                    @RequestHeader("userId") Long userId) {
        Movie movie = movieService.createMovie(movieMapper.moviePostDtoToMovie(moviePostDto), userId);
        MovieResponseDto response = movieMapper.movieToMovieResponseDto(movie);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //영화 정보 수정
    @PatchMapping("/{movie-id}")
    public ResponseEntity patchMovie(@PathVariable("movie-id") @Positive long movieId,
                                     @Positive long userId,
                                     @Valid @RequestBody MoviePatchDto moviePatchDto) {
        moviePatchDto.setMovieId(movieId);
        Movie movie = movieService.updateMovie(movieMapper.moviePatchDtoToMovie(moviePatchDto), userId);
        MovieResponseDto response = movieMapper.movieToMovieResponseDto(movie);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //전체 영화 조회
    @GetMapping
    public ResponseEntity getMovies(@Positive @RequestParam int page,
                                    @Positive @RequestParam int size) {
        Page<Movie> moviePage = movieService.findMovies(page - 1, size);
        List<Movie> movies = moviePage.getContent();
        List<MovieResponseDto> response = movieMapper.movieToMovieResponseDto(movies);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 평점 상위 영화 10개 조회
    @GetMapping("/movieTop10")
    public ResponseEntity getTop10Movies() {
        Page<Movie> moviePage = movieService.findTop10Movies();
        List<Movie> movies = moviePage.getContent();
        List<MovieResponseDto> response = movieMapper.movieToMovieResponseDto(movies);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //영화 정보 삭제
    @DeleteMapping("/{movie-id}")
    public ResponseEntity deleteMovie(@PathVariable("movie-id") @Positive long movieId,
                                      @Positive long userId) {
        movieService.deleteMovie(movieId, userId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //영화 키워드를 통한 쿼리문 검색
    @GetMapping("/key-word")
    public ResponseEntity getSearchMovie(@RequestParam(value = "key-word" ) String keyWord,
                                         @Positive int page) {
        Page<Movie> moviePage = movieService.findKeyWordMovies(keyWord, page);
        List<Movie> movies = moviePage.getContent();
        List<MovieResponseDto> response = movieMapper.movieToMovieResponseDto(movies);

        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}