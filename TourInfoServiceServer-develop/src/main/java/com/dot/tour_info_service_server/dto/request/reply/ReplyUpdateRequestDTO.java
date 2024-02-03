package com.dot.tour_info_service_server.dto.request.reply;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReplyUpdateRequestDTO {
  @NotNull(message = "rno cannot be null")
  private Long rno;
  @NotBlank(message = "text cannot be blank")
  private String text;
  @NotNull(message = "mno cannot be null")
  private Long mno;
}
