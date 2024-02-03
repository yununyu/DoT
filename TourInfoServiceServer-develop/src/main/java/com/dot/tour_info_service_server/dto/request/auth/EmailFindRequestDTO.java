package com.dot.tour_info_service_server.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EmailFindRequestDTO {
    @NotBlank(message = "name cannot be blank")
    private String name;
    @Email(message = "do not match email form")
    @NotBlank(message = "email cannot be blank")
    private String phone;
}
