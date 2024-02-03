package com.dot.tour_info_service_server.dto;


import com.dot.tour_info_service_server.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private Long mno;
    private String image;
    private String name;
    private String email;
    private String phone;
    private LocalDate birth;
    private Role role;
    private boolean fromSocial;
}
