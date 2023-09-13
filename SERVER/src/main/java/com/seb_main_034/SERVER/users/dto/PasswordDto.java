package com.seb_main_034.SERVER.users.dto;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class PasswordDto {

    @NotBlank
    @Length(min = 8)
    private String password;
}