package com.dot.tour_info_service_server.dto;

import com.dot.tour_info_service_server.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlaceDTO {
    private Long pno;
    private String name;
    private Double lng;
    private Double lat;
    private String roadAddress;
    private String localAddress;
    private String engAddress;
    private Category category;
    private int cart;
    private LocalDateTime regDate, modDate;
    private String image;
}
