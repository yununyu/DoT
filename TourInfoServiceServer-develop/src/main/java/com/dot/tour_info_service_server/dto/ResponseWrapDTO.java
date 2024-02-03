package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseWrapDTO<T> {
    private boolean result;
    private T data;
}