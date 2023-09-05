import React, { useState } from "react";
import styled from "styled-components";
import StarRating from "../component/StarRating";
import { ReactComponent as DeleteIcon } from "../images/baseline-delete-sweep.svg";

const CommentContainer = styled.div`
  margin: 20px;

  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 20px;
  background-color: #333333;
`;

const CommentInput = styled.textarea`
  width: 20rem;
  height: 10rem;
  resize: none;
  padding: 0.3rem;
  background-color: #404040;
  border-radius: 5px;
  color: white;
`;

const SubmitButton = styled.button`
  background-color: #ecd253;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;

  &:hover {
    background-color: #b89c14;
  }
`;

const CommentList = styled.div`
  margin-top: 20px;
  text-align: left;

  border-radius: 5px;
  padding: 0.5rem;
  background-color: #454545;

  .list-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .newest {
    cursor: pointer;
  }

  .star-rating {
    cursor: pointer;
  }
`;

const CommentBox = styled.div`
  padding: 0.5rem;
  margin: 0.8rem;
  border-top: 1px solid #969696;

  .comment-user {
    color: #a0a0a0;
  }

  .comment-rating {
    margin-top: 0.5rem;
  }

  .star-color {
    color: #ffd400;
  }

  .delete-button {
    display: flex;
    background-color: #a60000;
    color: white;
    border: none;
    padding: 4px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: #990000;
    }
  }

  .box-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comment-date {
    color: #a0a0a0;
    font-size: 0.8rem;
  }

  .comment {
    width: 15rem;
    margin-top: 0.5rem;
  }
`;

const MovieComment = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0.5);
  const [comments, setComments] = useState([]);
  const [sortingOption, setSortingOption] = useState("newest");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    const newComment = { comment, user: "", rating, date: new Date() };
    setComments([...comments, newComment]);

    setComment("");
    setRating(0.5);
  };

  const sortComments = (option) => {
    if (option === "newest") {
      return [...comments].sort((a, b) => b.date - a.date);
    } else if (option === "star-rating") {
      return [...comments].sort((a, b) => b.rating - a.rating);
    }
    return comments;
  };

  const handleDeleteComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1); // Remove the comment at the specified index
    setComments(updatedComments);
  };

  return (
    <CommentContainer>
      <h3>댓글</h3>
      <StarRating onRatingChange={handleRatingChange} />
      <CommentInput
        placeholder="댓글을 작성해주세요."
        value={comment}
        onChange={handleCommentChange}
      />
      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>

      <CommentList>
        <div className="list-space-between">
          <h3>댓글 목록</h3>
          <span className="row">
            <h4
              className={
                sortingOption === "newest" ? "newest active" : "newest"
              }
              onClick={() => setSortingOption("newest")}
            >
              최신순
            </h4>
            /
            <h4
              className={
                sortingOption === "star-rating"
                  ? "star-rating active"
                  : "star-rating"
              }
              onClick={() => setSortingOption("star-rating")}
            >
              별점순
            </h4>
          </span>
        </div>
        {sortComments(sortingOption).map((item, index) => (
          <CommentBox key={index}>
            <div className="comment-user">댓글 작성자: {item.user}</div>
            <div className="comment-rating">
              <span className="star-color">★</span> {item.rating * 1} / 5
            </div>
            <div className="comment">{item.comment}</div>
            <div className="box-space-between">
              <div className="comment-date">{item.date.toLocaleString()}</div>
              <span
                className="delete-button"
                onClick={() => handleDeleteComment(index)}
                title="삭제"
              >
                <DeleteIcon />
              </span>
            </div>
          </CommentBox>
        ))}
      </CommentList>
    </CommentContainer>
  );
};

export default MovieComment;
