package com.seb_main_034.SERVER.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private List<Cause> causes = new ArrayList<>();
    private RuntimeException exception;

    public static ErrorResponse of(ExceptionCode code) {
        ErrorResponse response = new ErrorResponse();
        Cause cause = new Cause(code.getStatus(), code.getMessage());
        response.causes.add(cause);
        return response;
    }

    @Getter
    @AllArgsConstructor
    public static class Cause {
        private int status;
        private String message;
    }
}
