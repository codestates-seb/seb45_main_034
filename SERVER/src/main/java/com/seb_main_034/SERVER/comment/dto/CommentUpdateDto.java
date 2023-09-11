package com.seb_main_034.SERVER.comment.dto;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class CommentUpdateDto {

    @NotBlank
    private String text;

}
