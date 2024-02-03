package com.dot.tour_info_service_server.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotBlank(message = "old password cannot be blank")
    private String oldPassword;
    @NotBlank(message = "new password cannot be blank")
    private String newPassword;
}
