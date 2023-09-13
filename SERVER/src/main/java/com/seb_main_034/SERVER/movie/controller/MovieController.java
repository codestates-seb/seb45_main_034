package com.seb_main_034.SERVER.movie.controller;

import com.amazonaws.services.dynamodbv2.xspec.L;
import com.seb_main_034.SERVER.comment.dto.CommentResponseDto;
import com.seb_main_034.SERVER.comment.entity.Comment;
import com.seb_main_034.SERVER.comment.mapper.CommentMapper;
import com.seb_main_034.SERVER.movie.dto.MovieCommentResponseDto;
import com.seb_main_034.SERVER.movie.dto.MoviePatchDto;
import com.seb_main_034.SERVER.movie.dto.MoviePostDto;
import com.seb_main_034.SERVER.movie.dto.MovieResponseDto;
import com.seb_main_034.SERVER.movie.entity.Movie;
import com.seb_main_034.SERVER.movie.mapper.MovieMapper;
import com.seb_main_034.SERVER.movie.service.MovieService;
import com.seb_main_034.SERVER.recommendation.service.RecommendationService;
import com.seb_main_034.SERVER.users.entity.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/movies")
@Validated
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    private final MovieMapper movieMapper;
    private final CommentMapper commentMapper;
    private final RecommendationService recommendationService;

    //영화 정보 등록
    @PostMapping
    public ResponseEntity postMovie(@Valid @RequestBody MoviePostDto moviePostDto,
                                    @AuthenticationPrincipal Users user) { // Long userId(X) 에서 수정했습니다
        Movie movie = movieService.createMovie(movieMapper.moviePostDtoToMovie(moviePostDto), user.getUserId());
        MovieResponseDto response = movieMapper.movieToMovieResponseDto(movie);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //영화 정보 수정
    @PatchMapping("/{movieId}")
    public ResponseEntity patchMovie(@PathVariable @Positive long movieId,
                                     @AuthenticationPrincipal Users user,
                                     @Valid @RequestBody MoviePatchDto moviePatchDto) {
        moviePatchDto.setMovieId(movieId);
        Movie movie = movieService.updateMovie(movieMapper.moviePatchDtoToMovie(moviePatchDto), user.getUserId());
        MovieResponseDto response = movieMapper.movieToMovieResponseDto(movie);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //전체 영화 조회
    @GetMapping("/all")
    public ResponseEntity getMovies(@Positive @RequestParam int page,
                                    @Positive @RequestParam int size) {
        Page<Movie> moviePage = movieService.findMovies(page - 1, size);
        List<Movie> movies = moviePage.getContent();
        List<MovieResponseDto> response = movieMapper.movieToMovieResponseDto(movies);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //단일 영화 조회
    @GetMapping("/{movieId}")
    public ResponseEntity viewMovie(@PathVariable @Positive Long movieId) {
        Movie movie = movieService.findMovie(movieId); // 영화정보를 가져옴
        List<Comment> commentList = movie.getCommentList(); // 해당영화에 대한 댓글목록을 가져옴
        List<CommentResponseDto> commentResponseDto = commentMapper.commentListToResponseListDto(commentList);
        MovieResponseDto response = movieMapper.movieToMovieResponseDto(movie); // 영화 entity를 Dto로 변환함
        MovieCommentResponseDto< MovieResponseDto, List<CommentResponseDto> > movieCommentResponseDto
                = new MovieCommentResponseDto<>(response, commentResponseDto);

        return new ResponseEntity<>(movieCommentResponseDto, HttpStatus.OK);
    }

    //사용자 선호 장르 영화 추천
    @GetMapping("/recommendations/user/{userId}")
    public ResponseEntity<List<MovieResponseDto>> getUserBasedRecommendations(@PathVariable Long userId) {
        List<MovieResponseDto> response = recommendationService.recommendMoviesBasedOnUserGenre(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //상위 평점 4점이상 영화 추천
    @GetMapping("/recommendations/top-rated")
    public ResponseEntity<List<MovieResponseDto>> getTopRatedRecommendations() {
        List<MovieResponseDto> response = recommendationService.recommendTopRatedMovies();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //영화 정보 삭제
    @DeleteMapping("/{movieId}")
    public ResponseEntity deleteMovie(@PathVariable @Positive long movieId,
                                      @AuthenticationPrincipal Users user) {
        movieService.deleteMovie(movieId, user.getUserId());

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //영화 키워드를 통한 쿼리문 검색
    @GetMapping("/search")
    public ResponseEntity getSearchMovie(@RequestParam String keyWord,
                                         @Positive int page) {
        Page<Movie> moviePage = movieService.findKeyWordMovies(keyWord, page);
        List<Movie> movies = moviePage.getContent();
        List<MovieResponseDto> response = movieMapper.movieToMovieResponseDto(movies);

        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}