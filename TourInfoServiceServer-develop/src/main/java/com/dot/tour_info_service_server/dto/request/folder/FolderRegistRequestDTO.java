package com.dot.tour_info_service_server.dto.request.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FolderRegistRequestDTO {
    private Long mno; //멤버 번호
    private String title; //폴더 명
}
