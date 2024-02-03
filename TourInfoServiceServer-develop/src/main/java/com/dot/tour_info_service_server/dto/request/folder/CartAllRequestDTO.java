package com.dot.tour_info_service_server.dto.request.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartAllRequestDTO {
    private Long mno; //멤버 번호
    private Long pno; //장소 번호
    private Long fno; //폴더 번호
}
