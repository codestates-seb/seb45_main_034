package com.seb_main_034.SERVER.movie.dto;

import lombok.Getter;
import lombok.Setter;
import org.w3c.dom.Text;

import javax.persistence.Id;

@Getter
@Setter
public class MoviePostDto {

    private String title;

    private String description;
}
