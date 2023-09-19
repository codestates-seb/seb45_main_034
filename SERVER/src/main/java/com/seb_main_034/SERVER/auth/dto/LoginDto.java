package com.seb_main_034.SERVER.auth.dto;

import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
public class LoginDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
