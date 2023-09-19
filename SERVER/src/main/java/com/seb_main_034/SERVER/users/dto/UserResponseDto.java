package com.seb_main_034.SERVER.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;

    @NotBlank
    @Email
    private String email;

    @Length(min = 2)
    private String nickName;

    private String proFilePicture;
}
