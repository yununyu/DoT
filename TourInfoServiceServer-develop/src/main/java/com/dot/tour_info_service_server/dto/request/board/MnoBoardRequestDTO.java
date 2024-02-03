package com.dot.tour_info_service_server.dto.request.board;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MnoBoardRequestDTO {
    @NotNull (message = "mno cannot be null")
    private Long mno;
}
