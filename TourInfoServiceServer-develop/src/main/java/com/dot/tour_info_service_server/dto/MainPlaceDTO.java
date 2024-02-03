package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MainPlaceDTO {
    private String name;
    private double lat;
    private double lng;
    private String localAddress;
    private String engAddress;
    private String roadAddress;
}
