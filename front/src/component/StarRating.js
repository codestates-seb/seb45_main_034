import React, { useState } from "react";
import styled from "styled-components";

const RatingBox = styled.div`
  display: flex;
`;

const RatingContainer = styled.div`
  position: relative;
  color: #808080;
  font-size: 30px;
  text-align: center;
`;

const RatingStar = styled.span`
  width: ${(props) => `${props.rating * 20}%`}; // 별점에 따라 너비 조정
  color: #ffd400;
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;
  transition: width 0.2s;
`;

const RatingInput = styled.input`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(5);

  const handleRatingChange = (event) => {
    const newRating = parseFloat(event.target.value);
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <RatingBox>
      <RatingContainer>
        ★★★★★
        <RatingStar rating={rating}>★★★★★</RatingStar>
        <RatingInput
          type="range"
          value={rating}
          step="0.5"
          min="0.5"
          max="5"
          onChange={handleRatingChange}
        />
      </RatingContainer>
    </RatingBox>
  );
};

export default StarRating;
