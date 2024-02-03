package com.dot.tour_info_service_server.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Builder
public class TokenDTO {
    private String token;
    private String refreshToken;
}
