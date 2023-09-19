import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StarRating from "../component/StarRating";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import formatDate from "./formatDate";

const instance = axios.create({
  baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

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

  .comment-title {
    font-size: 1.2rem;
  }

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

  .box-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .update-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: white;
    border: none;
    padding: 4px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: #333333;
    }
  }
  .cancel-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: #333333;
    }
  }
  .edit-button {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: transparent;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: #333333;
    }
  }

  .delete-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      background-color: #990000;
    }
  }

  .comment-date {
    color: #a0a0a0;
    font-size: 1rem;
    width: 10rem;
  }

  .comment {
    width: 15rem;
    margin-top: 0.5rem;
  }
`;

export default function MovieComment() {
  const [newCommentText, setNewCommentText] = useState("");
  const [editedCommentText, setEditedCommentText] = useState("");
  const [rating, setRating] = useState(0.5);
  const [comments, setComments] = useState("");
  const [sortingOption, setSortingOption] = useState("newest");
  const [editingIndex, setEditingIndex] = useState(null);
  const [commentIdToEdit, setcommentIdToEdit] = useState();
  const [ratings, setRatings] = useState();

  const { movieId } = useParams();
  const userId = Cookies.get("userId");

  const instance = axios.create({
    baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
  });

  instance.interceptors.request.use((config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  const sortComments = (option) => {
    if (option === "newest") {
      return [...comments].sort((a, b) => b.createAt.localeCompare(a.createAt));
    } else if (option === "star-rating") {
      return [...comments].sort((a, b) => b.rating - a.rating);
    }
    return comments;
  };

  const handleCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    if (movieId) {
      instance
        .get(`/api/movies/${movieId}`)
        .then((response) => {
          const data = response.data.commentList;
          const rdata = response.data.ratingList;
          setRatings(rdata);
          setNewCommentText(data);
          setComments(data);
        })
        .catch((error) => {
          console.error("", error);
        });
    } else {
      console.error("");
    }
  }, []);

  // 댓글 등록
  const handleSubmit = () => {
    const newComment = {
      nickName: userId,
      text: newCommentText,
      rating: rating,
      createAt: new Date(),
      modifyAt: new Date(),
    };

    instance
      .post(`/api/comment/${movieId}/add`, newComment)
      .then((response) => {
        console.log("댓글 등록 성공", response.data);
        setNewCommentText("");
        setRating(0.5);

        const ratingData = {
          nickName: userId,
          movieId: movieId,
          rating: rating,
        };

        instance
          .post("/api/ratings", ratingData)
          .then((response) => {
            console.log("영화 평점 저장 성공", response.data);
          })
          .catch((error) => {
            console.error("영화 평점 저장 오류", error);
          });

        instance
          .get(`/api/movies/${movieId}`)
          .then((response) => {
            const data = response.data.commentList;
            setComments(data);
            setNewCommentText("");
            setRating(0.5);
          })
          .catch((error) => {
            console.error("", error);
          });
      })
      .catch((error) => {
        console.error("댓글 등록 오류:", error);
      });
  };

  const handleEditComment = (index) => {
    const commentToEdit = comments[index];
    setEditedCommentText(commentToEdit.newCommentText);
    setEditingIndex(index);
    setcommentIdToEdit(commentToEdit.commentId);
    handleUpdateComment(index, commentIdToEdit);
  };

  // 댓글 수정
  const handleUpdateComment = (index, commentId) => {
    const commentToEdit = comments[index];
    const updatedComment = {
      text: editedCommentText,
    };

    instance
      .patch(
        `/api/comment/${movieId}/update/${commentToEdit.commentId}`,
        updatedComment
      )
      .then((response) => {
        const updatedComments = [...comments];
        updatedComments[index].text = editedCommentText;
        updatedComments[index].isEdited = true;
        setComments(updatedComments);
        setEditingIndex(null);
        setEditedCommentText("");
      })
      .catch((error) => {
        console.error("댓글 수정 오류:", error);
      });

    // 자체 댓글 수정
    // const updatedComments = [...comments];
    // updatedComments[index].text = editedCommentText;
    // updatedComments[index].createAt = new Date();
    // updatedComments[index].isEdited = true;
    // setComments(updatedComments);
    // setEditingIndex(null);
    // setEditedCommentText("");
  };

  const handleCancelEdit = () => {
    setEditedCommentText("");
    setEditingIndex(null);
  };

  // 댓글 삭제
  const handleDeleteComment = async (index) => {
    try {
      const commentToEdit = comments[index];

      await instance.delete(
        `/api/comment/${movieId}/delete/${commentToEdit.commentId}`
      );

      const updatedComments = [...comments];
      updatedComments.splice(index, 1);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };
console.log(rating)
  return (
    <CommentContainer>
      <StarRating onRatingChange={handleRatingChange} />
      <CommentInput
        placeholder="댓글을 작성해주세요."
        // value={newCommentText} // 댓글을 등록한만큼의 {object}가 입력창에 뜸
        onChange={handleCommentChange}
      />
      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>

      <CommentList>
        <div className="list-space-between">
          <span className="comment-title">댓글창</span>
          <div className="row">
            <div
              className={
                sortingOption === "newest" ? "newest active" : "newest"
              }
              onClick={() => setSortingOption("newest")}
            >
              <span className="select">최신순</span>
            </div>
            /
            <div
              className={
                sortingOption === "star-rating"
                  ? "star-rating active"
                  : "star-rating"
              }
              onClick={() => setSortingOption("star-rating")}
            >
              <span className="select">별점순</span>
            </div>
          </div>
        </div>
        {sortComments(sortingOption).map((item, index) => (
          <CommentBox key={index}>
            <div className="comment-user">{item.nickName}</div>
            <div className="comment-rating">
              <span className="star-color">★</span> {ratings.rating * 1} / 5
            </div>
            {editingIndex === index ? (
              <CommentInput
                placeholder="댓글을 작성해주세요."
                value={editedCommentText}
                onChange={(event) => setEditedCommentText(event.target.value)}
                style={{ width: "16.4rem", height: "8rem" }}
              />
            ) : (
              <div className="comment">{item.text}</div>
            )}
            <div className="box-space-between">
              <div className="comment-date">
                {formatDate(new Date(item.createAt))}
                {/* 시간대가 댓글을 등록한 시점이 아님 */}
                {/* {item.createAt} */}
                {item.isEdited && <span>(수정됨)</span>}
              </div>
              {editingIndex === index ? (
                <>
                  <span
                    className="update-button"
                    onClick={() => handleUpdateComment(index)}
                  >
                    저장
                  </span>
                  <span
                    className="cancel-button"
                    onClick={() => handleCancelEdit()}
                  >
                    취소
                  </span>
                </>
              ) : (
                <span
                  className="edit-button"
                  onClick={() => handleEditComment(index)}
                >
                  수정
                </span>
              )}
              <span
                className="delete-button"
                onClick={() => handleDeleteComment(index)}
              >
                삭제
              </span>
            </div>
          </CommentBox>
        ))}
      </CommentList>
    </CommentContainer>
  );
}
