package com.dot.tour_info_service_server.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisciplinaryAllResponseDTO {
    private Long dno;
    private Long mno;
    private String reason;
    private LocalDateTime strDate;
    private LocalDateTime expDate;
}
