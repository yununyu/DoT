package com.dot.tour_info_service_server.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EmailRequestDTO {
    @Email(message = "do not match email form")
    @NotBlank(message = "email cannot be blank")
    private String email;
}
