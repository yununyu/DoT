package com.dot.tour_info_service_server.dto;

import com.dot.tour_info_service_server.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberDetailDTO {
    private Long mno;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime regDate;
    private String role;
    private LocalDateTime expDate;
}
