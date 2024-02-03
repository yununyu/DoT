package com.dot.tour_info_service_server.dto.request.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisciplinaryRequestDTO {
    private Long sno; //신고 번호
    private Long mno; //제재할 유저
    private String reason; //제재 이유
}
