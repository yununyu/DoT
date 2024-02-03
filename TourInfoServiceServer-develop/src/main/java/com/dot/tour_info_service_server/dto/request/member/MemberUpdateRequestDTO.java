package com.dot.tour_info_service_server.dto.request.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberUpdateRequestDTO {
    @NotNull(message = "mno cannot be null")
    private Long mno;
    private MultipartFile image;
    @NotBlank(message = "name cannot be blank")
    private String name;
    @Pattern(regexp = "^(01\\d-\\d{3,4}-\\d{4})|(010-\\d{4}-\\d{4})$", message = "do not match phone form")
    private String phone;
}