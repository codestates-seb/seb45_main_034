package com.seb_main_034.SERVER.response;

import com.seb_main_034.SERVER.exception.ExceptionCode;
import com.seb_main_034.SERVER.exception.GlobalException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private int status;
    private String message;

    public static ErrorResponse sendUserExResponse(GlobalException globalException) {
        int status = globalException.getCode().getStatus();
        String message = globalException.getCode().getMessage();

        return new ErrorResponse(status, message);
    }

    public static ErrorResponse sendErrorResponse(HttpStatus httpStatus) {
        int status = httpStatus.value();
        String message = ExceptionCode.SERVER_ERROR.getMessage();

        for (ExceptionCode code : ExceptionCode.values()) {
            if (code.getStatus() == status) {
                message = code.getMessage();
                break;
            }
        }

        return new ErrorResponse(status, message);
    }

}
