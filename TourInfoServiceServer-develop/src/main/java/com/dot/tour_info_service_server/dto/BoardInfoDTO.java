package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardInfoDTO {
  private String title;
  private String content;
  private WriterDTO writerDTO;
  private Boolean isCourse;
  private Boolean isAd;
  private int likes;
  private Double score;
  private LocalDateTime regdate;
  private LocalDateTime moddate;
  private List<List<PostingPlaceBoardDTO>> postingPlaceBoardDTOS;
  private String[] images;
  private Boolean isLiked;
}

