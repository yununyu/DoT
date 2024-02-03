package com.dot.tour_info_service_server.dto;

import com.dot.tour_info_service_server.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
    private Long mno;
    private String email;
    private String password;
    private LocalDate birth;
    private String phone;
    private String name;
    private String image;
    private boolean fromSocial;
    private int disciplinary;
    private int businessId;
    private boolean isApprove;
    private Set<Role> roleSet = new HashSet<>();
}
