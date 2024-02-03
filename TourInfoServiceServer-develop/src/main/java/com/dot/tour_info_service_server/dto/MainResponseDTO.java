package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@Data
@AllArgsConstructor
public class MainResponseDTO {
    private List<MainPlaceResponseDTO> mostBoardPlace;
    private List<MainBoardResponseDTO> recentlyBoard;
    private List<MostListCourseDTO> mostLikeCourse;
    private List<MainBoardResponseDTO> followBoard;
    private List<MainBoardResponseDTO> adBoard;
}
