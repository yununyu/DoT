package com.dot.tour_info_service_server.dto.request.reply;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReplyDeleteRequestDTO {
  @NotNull(message = "rno cannot be null")
  private Long rno;
  @NotNull(message = "mno cannot be null")
  private Long mno;
}
