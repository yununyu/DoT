package com.dot.tour_info_service_server.dto.request.board;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceBoardRequestDTO {
  private Long bno;
  @NotBlank(message = "title cannot be blank.")
  private String title;
  @NotEmpty(message = "content cannot be empty.")
  private String content;
  @Max(value = 5 , message = "score cannot exceed 5 points.")
  @Min(value = 0 , message = "score cannot be less than 0. ")
  private Double score;
  @NotNull (message = "writer(mno) cannot be null")
  private Long writer;
  @NotNull (message = "place cannot be null")
  private Long place;
  private List<Long> images;
  private List<String> deleteImages;
}
