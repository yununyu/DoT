package com.dot.tour_info_service_server.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserProfileDTO {
    private Long mno;
    private String name;
    private Long followings;
    private Long followers;
    private Long cart;
    private String image;

}
