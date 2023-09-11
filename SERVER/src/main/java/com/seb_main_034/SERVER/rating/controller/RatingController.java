package com.seb_main_034.SERVER.rating.controller;

import com.seb_main_034.SERVER.rating.dto.RatingDTO;
import com.seb_main_034.SERVER.rating.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PostMapping
    public void saveRating(@RequestBody RatingDTO ratingDTO) {
        ratingService.saveRating(ratingDTO);
    }
}
