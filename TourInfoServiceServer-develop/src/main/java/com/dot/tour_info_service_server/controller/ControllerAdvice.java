package com.dot.tour_info_service_server.controller;

import com.dot.tour_info_service_server.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.UnknownHttpStatusCodeException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.sql.SQLException;

@RestControllerAdvice
public class ControllerAdvice {
    @ExceptionHandler(value = {BindException.class})
    public ResponseEntity<ErrorResponse> errorHandler(BindException e, final HttpServletRequest request) {

        return new ResponseEntity<>(
                ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getAllErrors().get(0).getDefaultMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> errorHandler(IllegalArgumentException e, final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {NullPointerException.class})
    public ResponseEntity<ErrorResponse> errorHandler(NullPointerException e, final HttpServletRequest request){
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    /*Http error*/
    @ExceptionHandler(value = {HttpClientErrorException.class})
    public ResponseEntity<ErrorResponse> errorHandler(HttpClientErrorException e, final HttpServletRequest request){
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.NOT_FOUND, e.getMessage(), request),
                HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(value = {HttpServerErrorException .class})
    public ResponseEntity<ErrorResponse> errorHandler(HttpServerErrorException e, final HttpServletRequest request){
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(value = {UnknownHttpStatusCodeException.class})
    public ResponseEntity<ErrorResponse> errorHandler(UnknownHttpStatusCodeException e,
                                                      final HttpServletRequest request){
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> runtimeExceptionHandle(RuntimeException e, final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> dataExceptionHandle(DataAccessException e, final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponse> sqlExceptionHandle(SQLException e, final HttpServletRequest request){
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> accessDeniedException(AccessDeniedException e,
                                                               final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.FORBIDDEN, "접근이 거부되었습니다", request),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    public ResponseEntity<ErrorResponse> unAuthorizedException(HttpClientErrorException.Unauthorized e,
                                                               final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.UNAUTHORIZED, e.getMessage(), request),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<ErrorResponse> mailException(MailException e, final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> MissingParameterException(MissingServletRequestParameterException e,
                                                                   final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> MaxUploadSizeExceededException(MaxUploadSizeExceededException e,
                                                                        final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.PAYLOAD_TOO_LARGE, e.getMessage(), request),
                HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> DisabledException(DataAccessException e, final HttpServletRequest request) {
        return new ResponseEntity<>(ErrorResponse.of(HttpStatus.UNAUTHORIZED, e.getMessage(), request),
                HttpStatus.UNAUTHORIZED);
    }
}
