package com.seb_main_034.SERVER.rating.repository;

import com.seb_main_034.SERVER.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}
