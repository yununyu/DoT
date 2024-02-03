package com.dot.tour_info_service_server.dto;

import com.dot.tour_info_service_server.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MainPlaceResponseDTO {
    private Long pno;
    private String name;
    private String src;
    private int cart;
    private Long board_count;
    private Category category;

}
