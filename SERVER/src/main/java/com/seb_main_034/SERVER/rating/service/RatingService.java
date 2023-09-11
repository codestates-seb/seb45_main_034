package com.seb_main_034.SERVER.rating.service;

import com.seb_main_034.SERVER.rating.dto.RatingDTO;
import com.seb_main_034.SERVER.rating.entity.Rating;
import com.seb_main_034.SERVER.rating.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    public Rating saveRating(RatingDTO ratingDTO) {
        Rating rating = new Rating();
        rating.setUserId(ratingDTO.getUserId());
        rating.setMovieId(ratingDTO.getMovieId());
        rating.setRating(ratingDTO.getRating());
        return ratingRepository.save(rating);
    }
}
