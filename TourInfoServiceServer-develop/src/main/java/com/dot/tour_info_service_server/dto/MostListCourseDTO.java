package com.dot.tour_info_service_server.dto;

import com.dot.tour_info_service_server.entity.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MostListCourseDTO {
    MainBoardResponseDTO mainBoardResponseDTO;
    List<MainPlaceDTO> placeList;
}
