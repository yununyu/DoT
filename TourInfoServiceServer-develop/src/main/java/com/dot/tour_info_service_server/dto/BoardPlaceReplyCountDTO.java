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
public class BoardPlaceReplyCountDTO {

    private Long pno;
    private Long bno;
    private String title;
    private String[] src;
    private Long replyCount;
    private String writer;
    private LocalDateTime regdate;
    private int likes;
    private Double score;
    private Boolean isAd;
    private Double lng;
    private Double lat;
    private String roadAddress;
    private String localAddress;
    private String engAddress;
    private String name;

}
