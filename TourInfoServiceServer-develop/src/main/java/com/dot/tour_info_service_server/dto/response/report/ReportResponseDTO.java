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
public class ReportResponseDTO {
    private Long sno;
    private Long complainant_mno;
    private String complainant;
    private Long defendant_mno;
    private String defendant;
    private Long bno;
    private Long rno;
    private String content;
    private Boolean isDone;
    private String message;
    private LocalDateTime regDate;
}
