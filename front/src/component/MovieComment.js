import React, { useState } from 'react';
import styled from 'styled-components';

const CommentContainer = styled.div`
  margin: 20px;
  border: solid 1px black;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
`;

const SubmitButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;

  &:hover {
    background-color: gray;
  }
`;

const CommentList = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const StarsContainer = styled.div`
  display: inline-block;
`;

const StarIcon = styled.span`
  font-size: 20px;
  color: ${props => (props.filled ? 'yellow' : 'gray')};
`;

const MovieComment = () => {
  const [rating, setRating] = useState('1');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [hoverRating, setHoverRating] = useState(null);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  const renderStars = (targetRating, enableHover) => {
    const numStars = 5;
    const starElements = [];
    for (let i = 1; i <= numStars; i++) {
      starElements.push(
        <StarIcon
          key={i}
          filled={i <= targetRating || (i - 0.5) <= targetRating}
          onMouseEnter={enableHover ? () => handleStarHover(i) : null}
          onMouseLeave={enableHover ? handleStarLeave : null}
          onClick={enableHover ? () => handleStarClick(i.toString()) : null}
        >
          {i <= targetRating || (i - 0.5) <= targetRating ? '★' : '☆'}
        </StarIcon>
      );
    }
    return starElements;
  };

  const handleSubmit = () => {
    const newComment = { rating, comment, user: '사용자 이름' };
    setComments([...comments, newComment]);
    
    setRating('1');
    setComment('');
  };

  return (
    <CommentContainer>
      <h3>댓글/별점</h3>
      <StarsContainer>
        {renderStars(parseFloat(rating), true)}
      </StarsContainer>
      <CommentInput
        placeholder="댓글을 작성해주세요."
        value={comment}
        onChange={handleCommentChange}
      />
      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>

      <CommentList>
        <h4>댓글/별점 목록</h4>
        {comments.map((item, index) => (
          <div key={index}>
            <p>별점: {renderStars(parseFloat(item.rating), false)}</p>
            <p>댓글 작성자: {item.user}</p>
            <p>댓글: {item.comment}</p>
          </div>
        ))}
      </CommentList>
    </CommentContainer>
  );
};

export default MovieComment;
