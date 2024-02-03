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
public class ReplyRequestDTO {
  private Long parentRno;
  @NotBlank(message = "text cannot be blank")
  private String text;
  @NotNull(message = "mno cannot be null")
  private Long mno;
  @NotNull(message = "bno cannot be null")
  private Long bno;
}
