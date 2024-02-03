package com.dot.tour_info_service_server.dto.response.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderItemResponseDTO {
    private Long fno; //폴더 번호
    private String title; //폴더 title
    private List<Long> pno; //장소 번호
    private List<String> name; //장소명
    private List<String> src; //이미지
}
