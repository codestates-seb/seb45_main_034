package com.seb_main_034.SERVER.users.dto;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class UserSaveDto {

    @Email
    @NotBlank(message = "필수 기입 항목입니다")
    private String email;

    @NotBlank(message = "필수 기입 항목입니다")
    @Length(min = 8)
    private String password;

    @NotBlank
    @Length(min = 2)
    private String nickName;

    private String proFilePicture;
}
