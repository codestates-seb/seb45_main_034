package com.seb_main_034.SERVER.exception;

import lombok.Getter;

public class UserException extends RuntimeException{

    @Getter
    private ExceptionCode code;

    public UserException(ExceptionCode code) {
        super(code.getMessage());
        this.code = code;
    }
    public UserException() {
        super();
    }

    public UserException(String message) {
        super(message);
    }

    public UserException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserException(Throwable cause) {
        super(cause);
    }

    protected UserException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
