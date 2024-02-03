package com.dot.tour_info_service_server.dto.response.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderNameResponseDTO {
    private Long fno; //폴더 번호
    private String title; //폴더 명
}
