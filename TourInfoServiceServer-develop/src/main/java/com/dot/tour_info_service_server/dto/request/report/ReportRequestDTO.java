package com.dot.tour_info_service_server.dto.request.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {
    private Long complainant; //신고자
    private Long defendant; //신고당하는 유저
    private Long bno; //게시글 번호
    private Long rno; //댓글 번호
    private String content; //내용
    private String message; //신고 사유
}
