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
public class BoardSearchDTO {
    private Long bno;
    private String title;
    private int likes;
    private Double score;
    private String writer;
    private LocalDateTime regDate;
    private String[] srcList;
    private boolean isAd;

}
