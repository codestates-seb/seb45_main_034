package com.seb_main_034.SERVER.movie.mapper;

import com.seb_main_034.SERVER.movie.dto.*;
import com.seb_main_034.SERVER.movie.entity.Movie;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    Movie moviePatchDtoToMovie(MoviePatchDto moviePatchDto);
    Movie moviePostDtoToMovie(MoviePostDto moviePostDto);

    default MovieResponseDto movieToMovieResponseDto(Movie movie) {
        if (movie == null) return null;

        MovieResponseDto movieResponseDto = new MovieResponseDto();
        if (movie.getMovieId() != null) {
            movieResponseDto.setMovieId(movie.getMovieId());
        }
        movieResponseDto.setTitle(movie.getTitle());
        movieResponseDto.setDescription(movie.getDescription());
        // 댓글부분예시: List<CommentDto.Response> commentResponse = movie.getComment().stream().map()
        return movieResponseDto;
    }

    List<MovieResponseDto> movieToMovieResponseDto(List<Movie> movies);

    default List<MovieResponseDto> toResponseDtos(List<Movie> movies) {
        return movies.stream()
                .map(this::movieToMovieResponseDto)
                .collect(Collectors.toList());
    }
}