package com.dot.tour_info_service_server.dto.request.auth;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class NewTokenRequestDTO {
    @NotEmpty(message = "token cannot be empty")
    private String refreshToken;
}
