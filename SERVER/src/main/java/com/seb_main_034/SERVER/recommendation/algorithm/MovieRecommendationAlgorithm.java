package com.seb_main_034.SERVER.recommendation.algorithm;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.seb_main_034.SERVER.movie.entity.Movie;
import com.seb_main_034.SERVER.movie.repository.MovieRepository;
import com.seb_main_034.SERVER.users.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class MovieRecommendationAlgorithm {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> recommendMovies(Users user) {
        List<Movie> recommendedMovies = new ArrayList<>();

        List<Movie> previouslyRecommendedMovies = user.getRecommendedMovies();

        Set<String> highRatedGenres = new HashSet<>();
        for (Movie movie : previouslyRecommendedMovies) {
            if (movie.getAverageRating() >= 4.0) {
                highRatedGenres.add(movie.getGenre());
            }
        }

        // Add movies of high-rated genres to the recommended list
        for (String genre : highRatedGenres) {
            recommendedMovies.addAll(movieRepository.findByGenre(genre));
        }

        // Add globally high-rated movies to the recommended list
        List<Movie> highRatedMovies = movieRepository.findByAverageRatingGreaterThanEqual(4.0);
        recommendedMovies.addAll(highRatedMovies);

        return recommendedMovies;
    }
}