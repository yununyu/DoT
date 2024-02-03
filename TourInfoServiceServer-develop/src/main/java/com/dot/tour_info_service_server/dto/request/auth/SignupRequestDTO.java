package com.dot.tour_info_service_server.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {
    @Email(message = "do not match email form")
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotBlank(message = "password cannot be blank")
    private String password;
    @Past(message = "birth cannot be the future")
    private LocalDate birth;
    @Pattern(regexp = "^(01\\d-\\d{3,4}-\\d{4})|(010-\\d{4}-\\d{4})$", message = "do not match phone form")
    private String phone;
    @NotBlank(message = "name cannot be blank")
    private String name;
    private String role;
    private String businessId;
}
