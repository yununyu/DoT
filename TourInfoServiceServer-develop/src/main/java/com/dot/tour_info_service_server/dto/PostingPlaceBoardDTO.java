package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PostingPlaceBoardDTO {
    private Long pno;
    private String name;
    private Double lng;
    private Double lat;
    private String src;
    private String roadAddress;
    private String localAddress;
    private String engAddress;
}
