package com.dot.tour_info_service_server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyListDTO {
    private Long rno;
    private Long mno;
    private Long bno;
    private String title;
    private String text;
    private LocalDateTime regdate;
    private boolean isCourse;
}
