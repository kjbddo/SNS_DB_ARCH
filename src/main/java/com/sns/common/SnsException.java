package com.sns.common;

import lombok.Getter;

@Getter
public class SnsException extends RuntimeException {

    private final ErrorCode errorCode;

    public SnsException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public SnsException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}

