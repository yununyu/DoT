package com.dot.tour_info_service_server.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchUserListDTO {
    private Long mno;
    private String image;
    private String name;
    private Long followings;
    private Long followers;
    private boolean followCheck;
}
