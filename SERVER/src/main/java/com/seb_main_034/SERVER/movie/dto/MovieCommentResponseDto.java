package com.seb_main_034.SERVER.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MovieCommentResponseDto<T, U> {

    private T movieResponseDto;
    private U commentList;
}
