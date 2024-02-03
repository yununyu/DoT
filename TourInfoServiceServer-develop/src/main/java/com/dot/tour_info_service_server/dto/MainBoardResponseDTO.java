package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MainBoardResponseDTO {
    private Long bno;
    private String title;
    private String src;
    private boolean isCourse;
    private String name;
    private int likes;
    private Double score;
    private LocalDateTime regDate;
}
