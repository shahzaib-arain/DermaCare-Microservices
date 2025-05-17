package com.virtual.dermacare_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    public UnauthorizedAccessException(String resourceName, String action) {
        super(String.format("You don't have permission to %s this %s", action, resourceName));
    }
}
